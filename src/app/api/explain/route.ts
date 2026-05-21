import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { risk_score, verdict, summary, flags } = body;

    // Check if live API key is set
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
      // Mock ELI5 data for offline/preview mode
      return NextResponse.json({
        simple_verdict: verdict === 'safe' 
          ? "This message looks safe. You don't need to worry about it."
          : verdict === 'suspicious'
            ? "This message looks a bit fishy. Someone might be trying to play a game with you."
            : "This message looks very dangerous. Someone is definitely trying to trick you.",
        simple_flags: (flags || []).map((f: any) => ({
          name: f.name,
          simple_explanation: f.name === 'Preview Mode Active'
            ? "The system is not connected to a live AI model key yet. It's just showing you a preview."
            : `This part is a warning sign. Scammers love to use formats like "${f.name}" to trap people. Be careful.`
        })),
        simple_actions: verdict === 'safe'
          ? [
              "You can read the message normally.",
              "Do not share secret codes with anybody regardless.",
              "If you are still doubtful, double check with a friend."
            ]
          : [
              "Do NOT click any links inside the message.",
              "Do NOT give anyone your secret bank PIN or OTP code.",
              "Show this message to a trusted friend or family member before doing anything else."
            ]
      });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const systemPrompt = `You are helping explain a scam detection result to someone who is not tech-savvy. 
They might be elderly, or they might want to explain this to a parent or grandparent.

Your job is to rewrite the analysis result in the simplest, friendliest language possible.

Rules:
- Use short sentences. Maximum 15 words per sentence.
- Never use technical words like "phishing", "domain", "malware", "metadata", "URL", "SSL".
- Speak directly to the user. Use "you" and "your".
- Be warm and calm. Do not be alarming or scary.
- Be specific about what the person should do.
- Respond only in valid JSON. No preamble, no markdown.`;

    const userPrompt = `Here is a scam detection result. Rewrite it in the simplest possible language.

Risk score: ${risk_score}/100
Verdict: ${verdict}
Summary: ${summary}
Flags found:
${(flags || []).map((f: any) => `- ${f.name}: ${f.explanation}`).join('\n')}

Respond with this exact JSON structure:
{
  "simple_verdict": <one simple sentence about whether this is safe or dangerous>,
  "simple_flags": [
    {
      "name": <original flag name>,
      "simple_explanation": <2-3 very simple sentences explaining why this flag is concerning>
    }
  ],
  "simple_actions": [
    <3 very simple action steps the user should take>
  ]
}`;

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    const jsonText = response.text().trim();

    let explainResult;
    try {
      explainResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse ELI5 response from Gemini:', jsonText);
      return NextResponse.json({ error: 'AI simplifying failed. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(explainResult);

  } catch (error: any) {
    console.error('Internal Server Error in /api/explain:', error);
    return NextResponse.json({ error: 'Simplification service failed.' }, { status: 500 });
  }
}
