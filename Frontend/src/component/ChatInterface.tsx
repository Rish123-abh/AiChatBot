import React, { useState, useEffect, useRef } from "react";
import { GrSend } from "react-icons/gr";
import { useTheme } from "../Context/useTheme";
import animationData from "../assets/animation/typing.json";

import Lottie from "react-lottie";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

import { socket } from "../Context/socket";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import Loader from "./Loader";
import { toast } from "react-toastify";
import type {  ToastOptions } from "react-toastify";
interface Message {
  _id: string;
  role: 'user' | 'ai';
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ChatInterface = () => {
  const { theme ,toggleTheme} = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const showOrUpdateToast = (id: string, options: ToastOptions & { render: string }) => {
  if (toast.isActive(id)) {
    toast.update(id, options);
  } else {
    toast(options.render, { ...options, toastId: id });
  }
};
  const TOAST_ID = "connection-status";
  useEffect(() => {
    socket.on("connect", () => {
      showOrUpdateToast(TOAST_ID, {
    render: "Connected to server ",
    type: "success",
    isLoading: false,
    autoClose: 2000,
  });
      setIsConnected(true);
    }
  );
    socket.on("disconnect", () => {
     showOrUpdateToast(TOAST_ID, {
    render: "Disconnected from server",
    type: "error",
    isLoading: false,
    autoClose: 2000,
    })
    setIsConnected(false);
  });

  socket.io.on("reconnect_attempt", () => {
   showOrUpdateToast(TOAST_ID, {
    render: `🔄 Reconnecting... `,
    type: "info",
    isLoading: true,
  })
  });

  socket.io.on("reconnect", () => {
      showOrUpdateToast(TOAST_ID, {
    render: "Reconnected!",
    type: "success",
    isLoading: false,
    autoClose: 2000,
  });
    setIsConnected(true);
  });
  
  socket.io.on("reconnect_failed", () => {
    showOrUpdateToast(TOAST_ID, {
    render: "Failed to reconnect. Refresh required.",
    type: "error",
    isLoading: false,
    autoClose: false,
  });
    setIsConnected(false);
  });

    socket.on("messageSaved", (savedMsg) => {
    setIsTyping(false);
    setMessages((prev) => [...prev, savedMsg]);
  });

    socket.on("aiStream", (chunk: string) => {

  setMessages(prev => {
    const last = prev[prev.length - 1];

    if (last?.role === "ai" && last._id === "streaming") {
      return [
        ...prev.slice(0, -1),
        { ...last, message: last.message + chunk }
      ];
    }

    // First chunk → create temporary AI message
    return [
      ...prev,
      { _id: "streaming", role: "ai", message: chunk }
    ];
  });
});

socket.on("aiMessageSaved", (savedMsg) => {
  setIsTyping(false);

  setMessages(prev => {
    return prev.map(m =>
      m._id === "streaming" ? savedMsg : m
    );
  });
});


  socket.on("typing", () => setIsTyping(true));
  socket.on("stopTyping", () => setIsTyping(false));

    return () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("messageSaved");
    socket.off("aiStream");
    socket.off("typing");
    socket.off("stopTyping");
    socket.io.off("reconnect_attempt");
    socket.io.off("reconnect");
    socket.io.off("reconnect_failed");
    };
  }, []);

  useEffect(() => {
      setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message/get?userId=guest-1`)
      .then((res) => res.json())
      .then((data) => {setMessages(data) 
    setLoading(false)});
    
       } ,[isConnected===true]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setMessage("");
    socket.emit("userMessage", { userId: "guest-1", message: message });

  };

    const handleClearChat = async() => {
      const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message/delete?userId=guest-1`, {
  method: "DELETE",
});
const data=await response.json();
console.log(data.message);
toast.success(data.message);
      setMessages([]);
  }
 return (
    <div className={`md:w-[50%] w-full h-screen  flex m-auto flex-col md:rounded-2xl md:shadow-2xl 
         backdrop-blur-lg border border-white/20 overflow-hidden `}>
      {/* Header */}
      <div className={`h-[65px] bg-linear-to-r from-blue-400 to-indigo-500 shadow-md 
        flex items-center justify-between px-4 ${theme==='dark'?"text-black":"text-white"} font-bold text-lg`}>
        <div>
        <span>AI Chat Assistant 🤖</span>
        <div className="flex items-center justify-center gap-2">
  <span
    className={`h-3 w-3 rounded-full ${
      isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"
    }`}
  ></span>

  <span className="text-sm">
    {isConnected ? "Online" : "Connecting..."}
  </span>
</div>

        </div>
        {theme === "dark" ? (
          <CiLight className="h-6 w-6 cursor-pointer" onClick={toggleTheme} />
        ) : (
          <MdDarkMode className="h-6 w-6 cursor-pointer" onClick={toggleTheme} />
        )}
      </div>

      {/* Messages */}
      {
        loading ? <Loader/>:
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) =>
          m.role === "user" ? (
            <SenderMessage key={m._id} {...m} />
          ) : (
            <ReceiverMessage key={m._id} {...m} />
          )
        )}

        {isTyping && (
          <div className="flex">
            <Lottie options={defaultOptions} width={50} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      }
      {messages.length >0 &&
        <button  onClick={handleClearChat} className=" md:w-[20%] w-[25%] absolute flex justify-center items-center bottom-18 right-1 mb-2  text-black ">Clear chat </button>
      }

      {/* Input Section */}
      <form
        onSubmit={handleSendMessage}
        className={`flex items-center gap-2 p-3 bg-white/20 backdrop-blur-md
        ${isTyping ? "opacity-50 " : ""}`}
      >
        <input
          type="text"
          className={`flex-1 p-2 rounded-xl outline-none bg-white/30 
            ${theme==='dark'?"placeholder-white":"placeholder-black"}  text-black`}
          placeholder="Ask me anything..."
          value={message}
          disabled={isTyping}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="bg-black/30 p-2 rounded-xl" disabled={isTyping}>
          <GrSend className="text-black  w-6 h-6" />
        </button>
      </form>
  </div>
);

};

export default ChatInterface;
