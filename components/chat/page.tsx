"use client";

import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI thinking
    setIsTyping(true);

    // Simulate API call
    try {
      // Replace with your actual API call
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: content }),
      // });
      // const data = await response.json();

      // Mock response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getMockResponse(content),
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
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
    <div className="h-full">
      <ChatArea 
        initialMessages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
      />
    </div>
  );
}