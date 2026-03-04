import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function chatWithGroq(messages: Array<{ role: string; content: string }>) {
  try {
    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    return {
      success: true,
      message: completion.choices[0]?.message?.content || 'No response',
    };
  } catch (error: any) {
    console.error('Groq API error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get response from AI',
    };
  }
}
