import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { action, text, context } = await request.json();

    if (!process.env.AI_API_KEY) {
      return NextResponse.json({ error: 'AI API Key is missing. Please configure it in environment variables.' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    if (action === 'summarize') {
      prompt = `Summarize the following blog post in a concise, engaging way:\n\n${context}`;
    } else if (action === 'chat') {
      prompt = `You are a helpful AI assistant for a specific blog post. Use the following blog post as context to answer the user's question.\n\nBlog Context:\n${context}\n\nUser Question:\n${text}`;
    } else if (action === 'paraphrase') {
      prompt = `Rewrite and paraphrase the following text to make it sound more professional and engaging. Return ONLY the paraphrased text without any extra conversational filler.\n\nText:\n${text}`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
