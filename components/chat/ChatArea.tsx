"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  MoreVertical, 
  Paperclip, 
  Mic, 
  Smile,
  Loader2,
  ChevronDown,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  feedback?: "like" | "dislike" | null;
}

interface ChatAreaProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  isTyping?: boolean;
}

export function ChatArea({ 
  initialMessages = [], 
  onSendMessage,
  isTyping = false 
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (onSendMessage) {
        await onSendMessage(input.trim());
      } else {
        // Simulate AI response
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: getMockResponse(input.trim()),
          role: "assistant",
          timestamp: new Date(),
          status: "sent",
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: "like" | "dislike") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, feedback: msg.feedback === type ? null : type } : msg
      )
    );
  };

  const getMockResponse = (input: string): string => {
    const responses = [
      "I understand your question. Let me help you with that. Based on what you've asked, I would suggest considering the following approach...",
      "That's a great question! Here's what I think about it. The key points to consider are...",
      "I appreciate your interest in this topic. Let me break it down for you step by step...",
      "Thanks for asking! This is actually a common question. The short answer is...",
      "Let me think about that for a moment. From my perspective, I would recommend...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-white">AI Assistant</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
              <Bot className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              How can I help you today?
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              Ask me anything about your project, technical questions, or just say hello!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                    : "bg-gradient-to-br from-blue-500 to-cyan-500"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 max-w-[80%] ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-[10px] opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </span>
                </div>

                {/* Actions for assistant messages */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-1 mt-1 ml-1">
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      title="Copy"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, "like")}
                      className={`p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                        message.feedback === "like"
                          ? "text-green-500"
                          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      }`}
                      title="Like"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, "dislike")}
                      className={`p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                        message.feedback === "dislike"
                          ? "text-red-500"
                          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      }`}
                      title="Dislike"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 pr-12 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              style={{ maxHeight: "200px" }}
            />
            <div className="absolute right-2 bottom-3 flex items-center gap-1">
              <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}