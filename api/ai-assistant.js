// Vercel Serverless Function: /api/ai-assistant
// Handles secure Gemini AI calls for CampVexi Smart Recommendations
// Required Environment Variables (Set in Vercel / Server Environment):
// 1. GEMINI_API_KEY - Google AI Studio API Key (https://aistudio.google.com/)
// 2. SUPABASE_URL - Your Supabase Project URL (e.g. https://xxx.supabase.co)
// 3. SUPABASE_ANON_KEY - Your Supabase Public Anon Key

export default async function handler(req, res) {
  // Enable CORS for Capacitor Android App (https://localhost) & Web Clients
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [], district = 'Chennai' } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message string is required' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message exceeds maximum length of 500 characters' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Server configuration error: GEMINI_API_KEY environment variable is not set.' 
      });
    }

    // System prompt with strict safety guidelines & domain bounding
    const systemPrompt = `
You are CampVexi AI, an expert assistant for social welfare services, community medical camps, emergency blood drives, NGO directory, and volunteer opportunities in Tamil Nadu.

SAFETY & SCOPE RULES:
1. Medical Disclaimer: For health questions, point ONLY to verified camps/services. NEVER diagnose illnesses or provide medical advice. Include the note: "This is not medical advice."
2. Emergency Protocol: If the user describes an urgent medical emergency, accident, or life-threatening situation, instruct them FIRST to dial 108 Tamil Nadu Ambulance Emergency Helpline before anything else.
3. Domain Boundary: Answer ONLY questions about Tamil Nadu social welfare, camps, NGOs, volunteering, donations, and emergency help. Politely decline unrelated topics.
4. Language: Respond in the exact same language (English or Tamil) as the user's message.
5. Accuracy: Do not invent non-existent camps or NGOs.

User District: ${district}
User Prompt: ${message}
Recent Chat History: ${JSON.stringify(history.slice(-4))}

Formulate a friendly, concise response and return ONLY valid JSON matching this schema:
{
  "message": "Friendly response summary with disclaimer or helpline notice if applicable",
  "recommendations": [
    {
      "id": "unique-id",
      "type": "Govt Camp | Private Camp | NGO | Emergency Alert | Volunteer Opening",
      "title": "Short title",
      "date": "Sep 30 • 9:00 AM",
      "venue": "Location venue name",
      "district": "District name",
      "spotsLeft": "Spots info"
    }
  ]
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error response:', errText);
      return res.status(502).json({ error: 'Failed to communicate with AI model', details: errText });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ error: 'Received empty response from AI model' });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      parsed = {
        message: rawText,
        recommendations: []
      };
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('AI assistant handler exception:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
