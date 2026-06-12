// /api/trends.js
// Scans social media for recent trends and maps them to Aakash content ideas.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Simple password check ---
  const password = req.headers['x-app-password'];
  if (!process.env.APP_PASSWORD || password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized — check your password' });
  }

  const { platforms, topic } = req.body || {};

  if (!Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ error: 'Select at least one platform' });
  }

  const topicLine = topic
    ? `Focus on trends relevant to: "${topic}".`
    : 'Focus on education, student life, exam prep, and youth culture.';

  const prompt = `You are a social media analyst for Aakash Institute, India's top JEE and NEET coaching brand. Search the web and find 2 trending topics or formats from the past 7 days on each of these platforms: ${platforms.join(', ')}. ${topicLine}

For each trend, suggest how Aakash can use it for student engagement content.

Return ONLY a valid JSON array, no markdown, no backticks. Each object must have this exact shape:
{
  "platform": "platform name",
  "trend": "trend name (max 8 words)",
  "whyTrending": "1 sentence explaining why this is gaining traction right now",
  "aakashAngle": "1 sentence on how Aakash can connect this to JEE/NEET content",
  "contentIdeas": [
    {"format": "Reel|Carousel|Static|Story", "idea": "specific content idea under 15 words"},
    {"format": "Reel|Carousel|Static|Story", "idea": "specific content idea under 15 words"},
    {"format": "Reel|Carousel|Static|Story", "idea": "specific content idea under 15 words"}
  ],
  "engagementTip": "1 short tip to maximise comments or shares for this content"
}`;

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
    if (start === -1 || end === -1) throw new Error('Could not parse trends from response');

    const trends = JSON.parse(rawText.slice(start, end + 1));
    return res.status(200).json({ trends });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}
