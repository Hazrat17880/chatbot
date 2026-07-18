"use client";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks/customHooks";
import { setUser, clearUser, selectUser } from "../../../redux/scliece/authSclice";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Paperclip,
  Mic,
  MoreHorizontal,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Edit,
  Trash2,
  ChevronDown,
  Sparkles,
  Zap,
  Plus,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Helper function to create welcome message
  const getWelcomeMessage = (): Message => ({
    id: Date.now().toString(),
    role: "assistant",
    content:
      "Hello! I'm your AI assistant. How can I help you today? I can answer questions, help with tasks, or just chat with you!",
    timestamp: new Date(),
  });

  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Google Login Effect
  useEffect(() => {
    const googleLogin = async () => {
      if (searchParams.get("login") !== "success") return;

      try {
        const response = await fetch("/api/google-login");
        const data = await response.json();

        console.log("Google Login Response:", data);

        if (!response.ok) {
          toast.error(data.message || "Google login failed");
          return;
        }

        dispatch(
          setUser({
            id: data.data.user.id,
            firstName: data.data.user.firstName,
            lastName: data.data.user.lastName,
            email: data.data.user.email,
            username: data.data.user.username,
            emailVerified: data.data.user.emailVerified,
            role: data.data.user.isAdmin ? "admin" : "user",
          })
        );

        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        toast.success("🎉 Login successful!");
        router.replace("/chat");
      } catch (error) {
        console.error("Google Login Error:", error);
        toast.error("Something went wrong");
      }
    };

    googleLogin();
  }, [searchParams, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (searchParams.get("login") === "success") {
      fetch("/api/google-login");
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // ✅ NEW CHAT FUNCTION - Clears all messages and starts fresh
  const startNewChat = () => {
    // If there are messages (more than just welcome), ask for confirmation
    if (messages.length > 1) {
      if (!window.confirm("Start a new chat? Your current conversation will be cleared.")) {
        return;
      }
    }
    
    // Reset messages to only the welcome message
    setMessages([getWelcomeMessage()]);
    setInput("");
    setIsLoading(false);
    setIsTyping(false);
    
    // Focus on input after reset
    setTimeout(() => inputRef.current?.focus(), 100);
    
    // Show success toast
    toast.success("✨ New chat started! History cleared.");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate response
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const responses = [
        "That's a great question! Let me think about that for a moment...",
        "I understand what you're saying. Here's what I think about that...",
        "Interesting point! Let me break this down for you...",
        "Based on what you've told me, here's my perspective...",
        "That's really insightful! Let me expand on that...",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Clear all messages (alternative method without confirmation)
  const clearAllMessages = () => {
    setMessages([getWelcomeMessage()]);
    setInput("");
    toast.success("🧹 Chat history cleared!");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header with New Chat Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Chat
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {messages.length > 1 ? `${messages.length - 1} messages` : "Start a conversation"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ NEW CHAT BUTTON - Clears history on same page */}
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          {/* Optional: Clear all messages button (no confirmation) */}
          {/* <button
            onClick={clearAllMessages}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Clear all messages"
          >
            <Trash2 className="w-4 h-4 text-zinc-400" />
          </button> */}

          <button className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-zinc-50/50 dark:bg-black/50">
        {/* Show empty state if only welcome message */}
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4">
              <Bot className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Welcome to Chat!
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              Start a conversation by typing your message below. I'm here to help you with anything you need!
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <button 
                onClick={() => setInput("What can you help me with?")}
                className="px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                What can you help me with?
              </button>
              <button 
                onClick={() => setInput("Tell me a fun fact")}
                className="px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Tell me a fun fact
              </button>
              <button 
                onClick={() => setInput("How does AI work?")}
                className="px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                How does AI work?
              </button>
            </div>
          </div>
        )}

        {/* Date Divider - Only show if there are messages */}
        {messages.length > 1 && (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {formatDate(messages[0].timestamp)}
            </span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}

        {messages.map((message, index) => {
          const isUser = message.role === "user";
          const showAvatar = index === 0 || messages[index - 1]?.role !== message.role;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {/* Assistant Avatar */}
              {!isUser && showAvatar && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              {!isUser && !showAvatar && <div className="flex-shrink-0 w-8" />}

              {/* Message Content */}
              <div className={`max-w-[85%] ${isUser ? "flex flex-col items-end" : ""}`}>
                {!isUser && showAvatar && (
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    AI Assistant
                  </p>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isUser
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>

                {/* Message Actions */}
                {!isUser && (
                  <div className="flex items-center gap-1 mt-2">
                    <button className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                    <button className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                    <button className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <ThumbsDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
                {isUser && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    {formatTime(message.timestamp)}
                  </span>
                )}
              </div>

              {/* User Avatar */}
              {isUser && showAvatar && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                </div>
              )}
              {isUser && !showAvatar && <div className="flex-shrink-0 w-8" />}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-end">
            <div className="flex gap-1">
              <button className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Paperclip className="w-5 h-5 text-zinc-400" />
              </button>
              <button className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Mic className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full resize-none rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 transition-all min-h-[52px] max-h-[200px]"
                rows={1}
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 h-[52px] w-[52px] rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              AI may produce inaccurate information • Press Enter to send
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>AI Powered</span>
              <span className="w-1 h-1 bg-zinc-300 rounded-full" />
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>GPT-4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}