// /api/week.js
// Builds a 7-day Instagram content plan for a given weekly focus.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = req.headers['x-app-password'];
  if (!process.env.APP_PASSWORD || password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized — check your password' });
  }

  const { focus } = req.body || {};

  if (!focus || !focus.trim()) {
    return res.status(400).json({ error: 'Enter a week focus' });
  }

  const prompt = `You are a social media manager for Aakash Institute, India's leading JEE and NEET coaching brand. Create a 7-day Instagram content plan for the week focused on: "${focus}".

Each day should have one main post. Mix content types: Reel, Carousel, Static, Story. Include a variety of: student stories, exam tips, motivational content, faculty content, product/course promos.

Return ONLY a valid JSON array, no markdown, no backticks:
[
  {
    "day": "Day name (e.g. Monday)",
    "date": "approximate date",
    "category": "Student story | Exam tip | Motivational | Faculty | Promo",
    "format": "Reel | Carousel | Static | Story",
    "title": "post title (max 10 words)",
    "caption": "2-line caption idea in Aakash's voice (mix of Hindi/English is fine)",
    "event": "optional — if tied to an exam event, name it, else empty string"
  }
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
        max_tokens: 2000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
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
    if (start === -1 || end === -1) throw new Error('Could not parse week plan from response');

    const plan = JSON.parse(rawText.slice(start, end + 1));
    return res.status(200).json({ plan });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}
