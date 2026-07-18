// app/api/chats/[chatId]/messages/stream/route.js
import { connectDB } from "../../../../../../lib/db"
import { Chat } from "../../../../../../lib/models/chat";
import openai from "../../../../../../lib/OpenAi";
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';



export async function POST(request, { params }) {
  try {
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

    // Find the chat (no authorization check)
    const chat = await Chat.findOne({
      _id: chatId,
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

    // Prepare conversation history
    const conversationHistory = chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Create a ReadableStream for streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const stream = await openai.chat.completions.create({
            model: chat.model || 'gpt-3.5-turbo',
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: 1000,
            stream: true,
          });

          let fullResponse = '';

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponse += content;
            
            // Send the chunk as SSE
            const data = JSON.stringify({ content, done: false });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Save complete response to database
          const assistantMessage = {
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
          };
          chat.messages.push(assistantMessage);
          chat.updatedAt = new Date();

          // Update title if it's the first message
          if (chat.messages.length === 2) {
            const firstMessage = content.trim();
            chat.title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
          }

          await chat.save();

          // Send completion signal
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in streaming route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process streaming request' },
      { status: 500 }
    );
  }
}