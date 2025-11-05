# 🤖 AI Realtime Chat Interface (WebSockets + Streaming LLM)

A real-time AI chat interface built with **React + TypeScript**, **Node.js**, **Socket.io**, and **Groq Llama 3.1** for streaming AI responses.  
Supports markdown rendering, dark/light theme, typing indicators, persistence, and more.


# Features
Real-time messaging via WebSockets ✅ 
AI streaming responses (token-by-token) ✅ 
Message persistence (MongoDB) ✅
Typing indicator animation  ✅ 
Dark/Light theme toggle ✅ 
Markdown rendering for AI responses  ✅ 
Copy message to clipboard ✅ 
Clear chat functionality ✅
Connection & Reconnection handling ✅
Input disabled while Ai response  ✅
Timestamps ✅

# Total Time Spent- 12 hours


---

## 🛠️ Tech Stack

### **Frontend**
- React + TypeScript
- Socket.io Client
- TailwindCSS
- React Markdown + Remark GFM
- React Toastify
- Lottie Animations

### **Backend**
- Node.js + Express + TypeScript
- Socket.io Server
- MongoDB + Mongoose
- Groq LLM (Llama 3.1 model)
- Server-Sent Events (SSE) token streaming

---

## 🚀 Getting Started

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-username/ai-chat-interface.git
cd ai-chat-interface

2️⃣ Setup Environment Variables

Create a .env file in both client and server folders.

Backend .env

PORT=5000
MONGODB_URL=your_mongodb_connection_string
GROQ_API_KEY=your_groq_key
FRONTEND_URL=http://localhost:5173

Frontend .env
VITE_BACKEND_URL=http://localhost:5000


3️⃣ Install Dependencies

Backend 
cd backend
npm install

Frontend
cd frontend
npm install

4️⃣ Run the Project

Start Backend
npm run dev

Start Frontend
npm run dev

