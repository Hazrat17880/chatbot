// app/api/chats/route.js
import { connectDB } from "../../../lib/db";
import { Chat } from "../../../lib/models/chat";
import { NextResponse } from 'next/server';

// GET - Fetch all chats for a user
export async function GET(request) {
  try {
    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const chats = await Chat.find({ 
      userId: userId,
      isArchived: false 
    })
    .sort({ updatedAt: -1 })
    .select('title createdAt updatedAt');

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

// POST - Create new chat
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, title } = body || {};

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate title length
    if (title && title.length > 100) {
      return NextResponse.json(
        { error: 'Title cannot exceed 100 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const chat = new Chat({
      userId: userId,
      title: title?.trim() || 'New Conversation',
      messages: [],
    });

    await chat.save();

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}