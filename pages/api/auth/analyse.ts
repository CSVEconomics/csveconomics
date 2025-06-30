import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen sind erlaubt' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt fehlt' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein präziser Datenanalyst für CSV-Daten. Antworte klar, strukturiert und sachlich.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const answer = completion.data.choices[0]?.message?.content;

    res.status(200).json({ answer });
  } catch (error: any) {
    console.error('Fehler bei Analyse-Request:', error);
    res.status(500).json({ error: 'Analyse fehlgeschlagen' });
  }
}