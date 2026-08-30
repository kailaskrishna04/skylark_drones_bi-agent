import { answer } from '../src/bi.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const question = String(req.body?.question ?? '').trim();

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const result = await answer(question, process.env);

    return res.status(200).json({ answer: result });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error
        ? error.message
        : 'Unexpected server error.'
    });
  }
}
