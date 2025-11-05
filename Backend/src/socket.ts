import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import Message from "./models/message.model";
import cors from 'cors';
dotenv.config();
const app = express();
console.log("GROQ KEY:", process.env.GROQ_API_KEY);
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
interface UserMessagePayload {
  userId: string;
  message: string;
}
const server=http.createServer(app);

const io=new Server(server,{
   cors:{
    origin:process.env.FRONTEND_URL,
   } 
});
  io.on("connection", (socket: Socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    socket.on("userMessage", async ({ userId, message }: UserMessagePayload) => {
  try {
    // 1. Save user message
    const savedMsg = await Message.create({ userId, role: "user", message: message });

    // 2. Send saved message back to frontend
    socket.emit("messageSaved", savedMsg);

    // 3. Tell UI that AI is typing
    socket.emit("typing");

    // 4. Call Groq API (stream)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content:message }],
        stream: true,
      }),
    });
    console.log("Groq response status:", response.status);
    if (!response.ok || !response.body) {
      socket.emit("stopTyping");
      socket.emit("aiStream", "Sorry, something went wrong.");
      return;
    }

    let aiText = "";
    let firstChunk = true;

    const decoder = new TextDecoder();

   for await (const chunk of response.body as any) {
  const decoded = decoder.decode(chunk);
     await new Promise(res => setTimeout(res, 1000));
  // Split SSE data into lines
  const lines = decoded.split("\n").filter(line => line.trim());

  for (const line of lines) {
    if (!line.startsWith("data:")) continue;

    const dataStr = line.replace("data: ", "").trim();

    // ✅ Ignore the final [DONE] message
    if (dataStr === "[DONE]") {
      continue;
    }

    let data;
    try {
      data = JSON.parse(dataStr);
    } catch {
      console.warn("Skipping non-JSON SSE line:", dataStr);
      continue;
    }

    const text = data.choices?.[0]?.delta?.content;
    if (!text) continue;

    if (firstChunk) {
      socket.emit("stopTyping");
      firstChunk = false;
    }

    socket.emit("aiStream", text);
    aiText += text;
  }
}


    // 5. Save final AI message
    const savedAiMsg = await Message.create({ userId, role: "ai", message: aiText });

    // 6. Emit saved final AI message
    socket.emit("aiMessageSaved", savedAiMsg);

  } catch (error) {
    console.error("Error processing AI message:", error);
    socket.emit("stopTyping");
    socket.emit("aiStream", "Error: Unable to generate response.");
  }
});


    // Handle disconnects
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  export { app, server ,io};
