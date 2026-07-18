"use client";

import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
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
  Plus,
  Sparkles,
  Zap,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { useAppSelector } from "@/hooks/customHooks";
import { selectUser } from "@/redux/scliece/authSclice";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface Chat {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get user from Redux
  const user = useAppSelector(selectUser);
  const userId = user?.id;

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load chats on mount
  useEffect(() => {
    if (userId) {
      loadChats();
    }
  }, [userId]);

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Load all chats
  const loadChats = async () => {
    if (!userId) {
      console.log("No userId found, skipping loadChats");
      return;
    }

    try {
      const response = await fetch(`/api/chat?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to load chats");
      const data = await response.json();
      setChats(data);
      
      // If no chat selected and there are chats, load the first one
      if (!currentChatId && data.length > 0) {
        loadChat(data[0]._id);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      toast.error("Failed to load chats");
    }
  };

  // Load specific chat
  const loadChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to load chat");
      const chat = await response.json();
      
      setCurrentChatId(chatId);
      
      // Convert messages to the format expected by the UI
      const formattedMessages = chat.messages.map((msg: any) => ({
        id: msg._id || Date.now().toString(),
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }));
      
      // If no messages, add welcome message
      if (formattedMessages.length === 0) {
        formattedMessages.push(getWelcomeMessage());
      }
      
      setMessages(formattedMessages);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error loading chat:", error);
      toast.error("Failed to load chat");
    }
  };

  // Create new chat
  const createNewChat = async () => {
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: userId,
          title: "New Conversation" 
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create chat");
      }
      
      const newChat = await response.json();
      
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat._id);
      setMessages([getWelcomeMessage()]);
      toast.success("✨ New chat created!");
    } catch (error: any) {
      console.error("Error creating chat:", error);
      toast.error(error.message || "Failed to create chat");
    }
  };

  // Delete chat
  const deleteChat = async (chatId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this chat?")) return;
    
    try {
      const response = await fetch(`/api/chat/${chatId}?userId=${userId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete chat");
      
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      
      if (currentChatId === chatId) {
        const remainingChats = chats.filter((chat) => chat._id !== chatId);
        if (remainingChats.length > 0) {
          loadChat(remainingChats[0]._id);
        } else {
          setCurrentChatId(null);
          setMessages([getWelcomeMessage()]);
        }
      }
      
      toast.success("Chat deleted");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  // Helper: Get welcome message
  const getWelcomeMessage = (): Message => ({
    id: Date.now().toString(),
    role: "assistant",
    content: "Hello! I'm your AI assistant. How can I help you today? I can answer questions, help with tasks, or just chat with you!",
    timestamp: new Date(),
  });

  // Send message with streaming
  const handleSendStreaming = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    // If no chat exists, create one first
    let chatId = currentChatId;
    if (!chatId) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: userId,
            title: input.trim().slice(0, 50) 
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create chat");
        }
        
        const newChat = await response.json();
        chatId = newChat._id;
        setCurrentChatId(chatId);
        setChats((prev) => [newChat, ...prev]);
      } catch (error: any) {
        console.error("Error creating chat:", error);
        toast.error(error.message || "Failed to create chat");
        return;
      }
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);

    // Add temporary assistant message for streaming
    const tempMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await fetch(`/api/chat/${chatId}/message/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage.content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) {
                // Update final message
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempMessage.id
                      ? { ...msg, content: fullContent, isStreaming: false }
                      : msg
                  )
                );
                break;
              }
              fullContent += data.content || "";
              // Update streaming message
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === tempMessage.id
                    ? { ...msg, content: fullContent }
                    : msg
                )
              );
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      // Update chat list
      loadChats();
    } catch (error: any) {
      console.error("Error in streaming:", error);
      toast.error(error.message || "Failed to get response");
      
      // Remove temporary message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendStreaming();
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

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Sidebar - Chat List */}
     

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
            
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
            <button
              onClick={createNewChat}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
            <button className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-zinc-50/50 dark:bg-black/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                Welcome to Chat!
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
                Start a conversation by typing your message below.
              </p>
            </div>
          )}

          {messages.length > 0 && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                  {formatDate(messages[0].timestamp)}
                </span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {messages.map((message, index) => {
                const isUser = message.role === "user";
                const showAvatar = index === 0 || messages[index - 1]?.role !== message.role;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    {!isUser && showAvatar && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    {!isUser && !showAvatar && <div className="flex-shrink-0 w-8" />}

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
                          {message.isStreaming && (
                            <span className="inline-block w-1 h-4 ml-1 bg-purple-500 animate-pulse" />
                          )}
                        </p>
                      </div>

                      {!isUser && !message.isStreaming && (
                        <div className="flex items-center gap-1 mt-2">
                          <button
                            onClick={() => copyToClipboard(message.content)}
                            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
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
            </>
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
                onClick={handleSendStreaming}
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
    </div>
  );
}