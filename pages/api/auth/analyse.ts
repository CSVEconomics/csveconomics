import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Kein Prompt übermittelt.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const answer = completion.choices?.[0]?.message?.content || 'Keine Antwort erhalten.';
    res.status(200).json({ answer });
  } catch (error: any) {
    console.error('Analyse-Fehler:', error);
    res.status(500).json({ error: 'Fehler bei der Analyse.' });
  }
}
