// /api/agent.js — Single backend endpoint for all 10 modules
// Checks APP_PASSWORD, then calls Anthropic with ANTHROPIC_API_KEY (both from Vercel env vars)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-app-password');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // --- Password check ---
  const submitted = req.headers['x-app-password'];
  if (!process.env.APP_PASSWORD || submitted !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const { prompt, useSearch } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  const SYSTEM = `You are the AI brain of the Aakash Social Media Command Centre.
Aakash Institute is India's leading JEE and NEET coaching brand.
Think simultaneously as: Social Media Manager + Content Strategist + Trend Analyst + Creative Director + Growth Marketer + Competitor Researcher.
Primary goal: answer "What should Aakash post next and why?"
Primary platform: Instagram. Secondary: YouTube Shorts, LinkedIn, X.
Content pillars: Topper Stories, NEET/JEE Tips, Motivation, Parent Stories, Faculty Content, Course Promos, Results, Admissions, Exam Updates.
Brand voice: aspirational, authentic, student-first. Hinglish is welcome and often preferred.
Always avoid: generic motivational quotes, low-value facts, repetitive admission promos.
Always prioritise: student aspirations, emotions, parent pride, rank stories, exam strategy, faculty authority, timely exam updates.
Return ONLY valid JSON arrays — no markdown, no backticks, no prose outside JSON.`;

  try {
    const body = {
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    };

    if (useSearch) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
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
    if (start === -1 || end === -1) throw new Error('Could not parse JSON from response');

    const parsed = JSON.parse(rawText.slice(start, end + 1));
    return res.status(200).json({ data: parsed });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}
