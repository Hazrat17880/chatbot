// app/api/chats/[chatId]/messages/route.js
import {connectDB } from "../../../../../lib/db"
import { Chat } from "../../../../../lib/models/chat"
import openai from "../../../../../lib/OpenAi"
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { chatId } = await params;
    const { content } = await request.json();

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the chat
    const chat = await Chat.findOne({
      _id: chatId,
      userId: session.user.id,
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    chat.messages.push(userMessage);

    // Prepare conversation history for OpenAI
    const conversationHistory = chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: chat.model || 'gpt-3.5-turbo',
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI message
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      tokens: completion.usage.total_tokens,
    };
    chat.messages.push(assistantMessage);
    chat.updatedAt = new Date();

    // Update title if it's the first user message
    if (chat.messages.length === 2) {
      const firstMessage = content.trim();
      chat.title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    }

    await chat.save();

    return NextResponse.json({
      userMessage,
      assistantMessage,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('Error in chat message:', error);
    
    // Handle OpenAI specific errors
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}