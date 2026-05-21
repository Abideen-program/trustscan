import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

// In-memory rate limiting store
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_COUNT = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Helper to convert base64 image data into a Gemini generative part
function fileToGenerativePart(base64Data: string, mimeType: string) {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP-based Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const now = Date.now();
    const hourAgo = now - RATE_LIMIT_WINDOW;
    
    const ipHistory = rateLimitMap.get(ip) || [];
    const recentScans = ipHistory.filter((timestamp) => timestamp > hourAgo);
    
    if (recentScans.length >= RATE_LIMIT_COUNT) {
      return NextResponse.json(
        { error: 'Scan limit exceeded. You can perform up to 10 scans per hour.' },
        { status: 429 }
      );
    }
    
    recentScans.push(now);
    rateLimitMap.set(ip, recentScans);

    // 2. Parse request body
    const body = await req.json();
    const { type, content, mimeType, name_honey, language } = body;

    // Honeypot check to block automated bot submissions
    if (name_honey) {
      return NextResponse.json({ error: 'System processing error.' }, { status: 400 });
    }

    if (!type || !content) {
      return NextResponse.json({ error: 'Missing input parameters (type or content).' }, { status: 400 });
    }

    if (!['text', 'url', 'image'].includes(type)) {
      return NextResponse.json({ error: 'Invalid input type.' }, { status: 400 });
    }

    // 3. Input Validation
    if (type === 'text') {
      if (content.length > 3000) {
        return NextResponse.json({ error: 'Message exceeds the 3000 characters limit.' }, { status: 400 });
      }
      if (content.trim().length < 10) {
        return NextResponse.json({ error: 'Message must contain at least 10 characters.' }, { status: 400 });
      }
    } else if (type === 'url') {
      try {
        new URL(content);
      } catch (_) {
        return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
      }
    } else if (type === 'image') {
      if (!mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
        return NextResponse.json({ error: 'Unsupported screenshot type. Please upload JPG, PNG or WEBP.' }, { status: 400 });
      }
      // Content size estimation from base64 (roughly 4/3 of actual size)
      const estimatedSize = (content.length * 3) / 4;
      if (estimatedSize > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Screenshot exceeds 5MB size limit.' }, { status: 400 });
      }
    }

    // 4. Initialize Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
      // Mock result if API Key is not set up
      const mockId = `mock-result-${Date.now()}`;
      return NextResponse.json({
        id: mockId,
        risk_score: 75,
        verdict: 'high_risk',
        summary: 'This simulated report is running in preview mode because the GEMINI_API_KEY is not configured yet.',
        scam_type: 'Phishing link',
        flags: [
          {
            name: 'Preview Mode Active',
            explanation: 'The system has not been connected to a live Gemini API key. Configure it in .env.local to scan real text.',
            severity: 'high',
          },
          {
            name: 'Urgency Language Detected (Simulated)',
            explanation: 'The message prompts the reader to take swift actions immediately to avoid account closure.',
            severity: 'high',
          }
        ],
        what_to_do: [
          'Add your GEMINI_API_KEY to your local configuration.',
          'Always ignore requests that pressure you for urgent operations.',
          'Verify message origins through trusted independent directories.'
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

    let systemPrompt = `You are a scam detection assistant. Your job is to analyse messages, URLs, and screenshots for patterns commonly associated with scams, phishing, and fraud.

You do NOT determine if something is definitely a scam. You identify risk patterns and explain them in plain, simple language that a non-technical person can understand.

You MUST always respond with valid JSON matching the user's requested schema. Do not output any Markdown tags like \`\`\`json, preamble, or comments. Just raw JSON.

Scoring guide:
- 0–30: No significant patterns found. Low risk.
- 31–65: 1–2 moderate patterns found. Suspicious but not conclusive.
- 66–100: Multiple strong patterns found. High risk.

Scam type categories:
"Prize claim scam", "BVN/NIN verification scam", "Fake bank alert", "Job offer scam", "Loan scam", "Impersonation scam", "Phishing link", "Investment scam", "Romance scam", "Delivery scam", "Government impersonation", "Unknown pattern"`;

    if (language === 'pidgin') {
      systemPrompt += `\n\nIMPORTANT: Write ALL generated text fields in Nigerian Pidgin English. 
This includes: summary, flag explanations, and what_to_do action steps.
The JSON keys must remain in English. Only the values should be in Pidgin.

Write natural, warm, conversational Pidgin — the kind a Lagos person would speak to their mother.

Examples of good Pidgin phrasing:
- Instead of "This message contains urgency language" → "Dem dey rush you for this message. Na sign say something no right."
- Instead of "Do not click any links" → "No click any link wey dem send you."
- Instead of "This appears to be a phishing attempt" → "E look like say dem wan use this message cheat you."
- "Dem wan use this message cheat you. E no be real."
- "This kind message na wetin fraudsters dey send. Shine your eye."
- "No give anybody your PIN or OTP. If you do, dem go clean your account."
- "E get 3 things inside this message wey no make sense."
- "Na scam. Block the person and report am."`;
    }

    let promptContents: any[] = [systemPrompt];

    if (type === 'text') {
      promptContents.push(`Analyse this message for scam patterns:

"""
${content}
"""

Respond with this exact JSON structure:
{
  "risk_score": <integer 0-100>,
  "verdict": <"safe" | "suspicious" | "high_risk">,
  "summary": <one plain-English sentence summarising the finding>,
  "scam_type": <closest matching category from the list>,
  "flags": [
    {
      "name": <short flag name>,
      "explanation": <2-3 sentence plain-language explanation of why this is a red flag>,
      "severity": <"low" | "medium" | "high">
    }
  ],
  "what_to_do": [
    <3 specific action items the user should take, as plain strings>
  ]
}

If no significant patterns are found, return an empty flags array and a risk_score between 0 and 25.`);
    } else if (type === 'url') {
      promptContents.push(`Analyse this URL for scam patterns. Do not visit the URL — analyse only its structure, domain name, subdomains, and any recognisable patterns:

URL: ${content}

Respond with this exact JSON structure:
{
  "risk_score": <integer 0-100>,
  "verdict": <"safe" | "suspicious" | "high_risk">,
  "summary": <one plain-English sentence summarising the finding>,
  "scam_type": <closest matching category from the list>,
  "flags": [
    {
      "name": <short flag name>,
      "explanation": <2-3 sentence plain-language explanation of why this is a red flag>,
      "severity": <"low" | "medium" | "high">
    }
  ],
  "what_to_do": [
    <3 specific action items the user should take, as plain strings>
  ]
}

If no significant patterns are found, return an empty flags array and a risk_score between 0 and 25.`);
    } else if (type === 'image') {
      const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
      const imagePart = fileToGenerativePart(base64Data, mimeType);
      
      promptContents.push(imagePart);
      promptContents.push(`This is a screenshot of a message or notification. Extract the text content from the image and analyse it for scam patterns.

Respond with this exact JSON structure:
{
  "risk_score": <integer 0-100>,
  "verdict": <"safe" | "suspicious" | "high_risk">,
  "summary": <one plain-English sentence summarising the finding>,
  "scam_type": <closest matching category from the list>,
  "flags": [
    {
      "name": <short flag name>,
      "explanation": <2-3 sentence plain-language explanation of why this is a red flag>,
      "severity": <"low" | "medium" | "high">
    }
  ],
  "what_to_do": [
    <3 specific action items the user should take, as plain strings>
  ]
}

If no significant patterns are found, return an empty flags array and a risk_score between 0 and 25.`);
    }

    // 5. Call Gemini API
    const result = await model.generateContent(promptContents);
    const response = await result.response;
    const jsonText = response.text().trim();
    
    // Parse findings safely
    let analysisResult;
    try {
      analysisResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse JSON response from Gemini:', jsonText);
      return NextResponse.json({ error: 'AI parsing failed. Please try again.' }, { status: 500 });
    }

    // 6. Save to Supabase (anonymized metadata only — NO original text content stored)
    let dbRecordId = null;
    const isSupabaseReady = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url_here';

    if (isSupabaseReady) {
      const { data: insertData, error: dbError } = await supabase
        .from('scan_results')
        .insert({
          risk_score: analysisResult.risk_score,
          verdict: analysisResult.verdict,
          summary: analysisResult.summary,
          flags: analysisResult.flags || [],
          what_to_do: analysisResult.what_to_do || [],
          scam_type: analysisResult.scam_type || 'Unknown pattern',
          input_type: type,
          language: language || 'en',
        })
        .select('id')
        .single();

      if (dbError) {
        console.error('Database log error:', dbError);
      } else if (insertData?.id) {
        dbRecordId = insertData.id;
      }
    }

    // Fallback ID if Supabase is bypassed/unavailable
    const finalId = dbRecordId || `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      id: finalId,
      ...analysisResult
    });

  } catch (error: any) {
    console.error('Internal Server Error in /api/analyse:', error);
    return NextResponse.json({ error: 'Analysis failed due to a server error.' }, { status: 500 });
  }
}
