import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
});

export async function POST(request: Request) {
  try {
    const { action, text, context } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is missing. Please configure it in environment variables.' }, { status: 500 });
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'summarize') {
      systemPrompt = 'You are a helpful assistant that summarizes blog posts concisely and engagingly.';
      userPrompt = `Summarize the following blog post:\n\n${context}`;
    } else if (action === 'chat') {
      systemPrompt = `You are a helpful AI assistant for a specific blog post. Use the provided blog post as context to answer the user's questions accurately based on the text. If the user asks something completely unrelated, politely guide them back to the topic of the blog.\n\nBlog Context:\n${context}`;
      userPrompt = text;
    } else if (action === 'paraphrase') {
      systemPrompt = 'You are an expert editor. Rewrite and paraphrase the provided text to make it sound more professional, clear, and engaging. Return ONLY the paraphrased text without any extra conversational filler.';
      userPrompt = `Text to paraphrase:\n${text}`;
    } else if (action === 'enhance') {
      systemPrompt = 'You are an expert editor and grammar specialist. Fix any broken English, correct grammar mistakes, and logically complete any broken or unfinished thoughts in the provided text while keeping the original meaning and tone intact. Return ONLY the enhanced text without conversational filler.';
      userPrompt = `Text to enhance:\n${text}`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    });

    const responseText = response.choices[0]?.message?.content || '';

    return NextResponse.json({ result: responseText });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
