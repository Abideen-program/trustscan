import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { risk_score, verdict, summary, flags, what_to_do, target_language } = body;

    if (!target_language || !['en', 'pidgin'].includes(target_language)) {
      return NextResponse.json({ error: 'Missing or invalid target language.' }, { status: 400 });
    }

    const isPidgin = target_language === 'pidgin';

    // Check if live API key is set
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
      // Mock translations for offline preview mode
      if (isPidgin) {
        return NextResponse.json({
          summary: "This look like simulated shege preview wey we set up because Gemini API Key never connect.",
          flags: (flags || []).map((f: any) => ({
            name: f.name === 'Preview Mode Active' ? 'Preview Mode Dey Active' : f.name,
            explanation: f.name === 'Preview Mode Active'
              ? 'The system never connect to live AI key yet. E dey show you mock demo now.'
              : `Na warning sign be this. Fraudsters like to use '${f.name}' pattern to tap people money.`,
            severity: f.severity,
          })),
          what_to_do: [
            "Put your GEMINI_API_KEY inside your local .env.local file.",
            "No click any link wey dem send you, shine your eye.",
            "Confirm from your bank or friends before you do anything."
          ]
        });
      } else {
        // Translate back to English
        return NextResponse.json({
          summary: "This simulated report is running in preview mode because the GEMINI_API_KEY is not configured yet.",
          flags: (flags || []).map((f: any) => ({
            name: f.name,
            explanation: 'The system has not been connected to a live Gemini API key. Configure it in .env.local to scan real text.',
            severity: f.severity,
          })),
          what_to_do: [
            "Add your GEMINI_API_KEY to your local configuration.",
            "Always ignore requests that pressure you for urgent operations.",
            "Verify message origins through trusted independent directories."
          ]
        });
      }
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const systemPrompt = `You are a professional linguistic translator. Your job is to translate a scam analysis report between English and Nigerian Pidgin English.
You MUST output valid JSON only matching the schema exactly. No preamble, no markdown.

Translate natural, warm, conversational Pidgin that a Lagos person would speak to their mother. If translating to English, write standard, polite English.

The JSON keys must remain in English. Only translate the string values.`;

    const userPrompt = `Translate this scan analysis result to ${isPidgin ? 'Nigerian Pidgin English' : 'Standard English'}.

Risk score: ${risk_score}
Verdict: ${verdict}
Summary: ${summary}
Flags:
${(flags || []).map((f: any) => `- ${f.name}: ${f.explanation}`).join('\n')}
What to do:
${(what_to_do || []).map((w: string) => `- ${w}`).join('\n')}

Respond with this exact JSON structure:
{
  "summary": <translated summary sentence>,
  "flags": [
    {
      "name": <original flag name or its direct translation>,
      "explanation": <translated flag explanation>,
      "severity": <keep original severity value>
    }
  ],
  "what_to_do": [
    <translated action steps matching the original array length exactly>
  ]
}`;

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    const jsonText = response.text().trim();

    let translationResult;
    try {
      translationResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse translation response from Gemini:', jsonText);
      return NextResponse.json({ error: 'AI translation failed. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(translationResult);

  } catch (error: any) {
    console.error('Internal Server Error in /api/translate-result:', error);
    return NextResponse.json({ error: 'Translation service failed.' }, { status: 500 });
  }
}
