// lib/openai.ts
import OpenAI from 'openai';

// Validate API key exists
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 60000,
});

// Type definitions
export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export async function getChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: ChatOptions = {}
): Promise<OpenAI.Chat.ChatCompletion> {
  try {
    const completion = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
      stream: options.stream ?? false,
    });
    return completion;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`OpenAI API failed: ${error.message}`);
  }
}

export default openai;