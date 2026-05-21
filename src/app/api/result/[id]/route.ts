import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Missing scan ID parameter.' }, { status: 400 });
    }

    // Check if Supabase connection is established
    const isSupabaseReady = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url_here';

    if (isSupabaseReady && !id.startsWith('mock-') && !id.startsWith('local-')) {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase lookup error:', error);
        return NextResponse.json({ error: 'Report not found in database.' }, { status: 404 });
      }

      return NextResponse.json(data);
    }

    // FALLBACK Mock Data Generator for Local Development Previews
    // Allows testing the results page layout completely offline or during onboarding.
    const isMock = id.startsWith('mock-');
    
    return NextResponse.json({
      id: id,
      risk_score: isMock ? 75 : 42,
      verdict: isMock ? 'high_risk' : 'suspicious',
      summary: isMock 
        ? 'This simulated report is running in preview mode because the GEMINI_API_KEY is not configured yet.' 
        : 'This suspicious URL mimics GTBank brand assets and demands actions on unauthenticated forms.',
      scam_type: isMock ? 'Prize claim scam' : 'Phishing link',
      flags: [
        {
          name: isMock ? 'Preview Mode Active' : 'Imposter domain name',
          explanation: isMock 
            ? 'The system has not been connected to a live Gemini API key. Configure it in .env.local to scan real text.'
            : 'The domain mimics a legitimate bank but uses minor letter changes or alternative subdomains (e.g. gtbank-login-alert.net).',
          severity: 'high',
        },
        {
          name: isMock ? 'Urgency Language Detected' : 'Unsecure payment portal',
          explanation: isMock
            ? 'The message pressures you to operate immediately to gain your prize before it is cancelled.'
            : 'The form prompts you to enter PIN codes, credit cards, or passwords over standard HTTP interfaces.',
          severity: isMock ? 'high' : 'medium',
        }
      ],
      what_to_do: isMock ? [
        'Add your GEMINI_API_KEY to your local configuration.',
        'Always ignore requests that pressure you for urgent operations.',
        'Verify message origins through trusted independent directories.'
      ] : [
        'Do not enter any bank card credentials or passwords.',
        'Delete the SMS/email containing this link immediately.',
        'Report this imposter site URL to the cybercrime division of your bank.'
      ],
      created_at: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error fetching result:', error);
    return NextResponse.json({ error: 'Server error retrieving scan details.' }, { status: 500 });
  }
}
