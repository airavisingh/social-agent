// /api/hooks.js
// Generates scroll-stopping opening hooks for a given topic and post format.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = req.headers['x-app-password'];
  if (!process.env.APP_PASSWORD || password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized — check your password' });
  }

  const { topic, format } = req.body || {};

  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Enter a topic first' });
  }

  const prompt = `You are a social media content writer for Aakash Institute, India's top JEE and NEET coaching brand targeting students aged 15–22.

Write 5 scroll-stopping opening hooks for a ${format || 'Reel'} about: "${topic}"

Each hook should work as the first line of a caption or the first 2 seconds of a reel script. Mix styles: curiosity gap, bold statement, relatable scenario, Hinglish, question format.

Return ONLY a valid JSON array, no markdown, no backticks:
[
  {"hook": "the hook text", "style": "style name (e.g. Curiosity gap / Hinglish / Bold stat / Relatable scenario / Question)", "whyItWorks": "1 short sentence"}
]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errText}`);
    }

    const data = await response.json();

    let rawText = '';
    for (const block of data.content || []) {
      if (block.type === 'text') rawText += block.text;
    }

    rawText = rawText.replace(/```json|```/g, '').trim();
    const start = rawText.indexOf('[');
    const end = rawText.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error('Could not parse hooks from response');

    const hooks = JSON.parse(rawText.slice(start, end + 1));
    return res.status(200).json({ hooks });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}
