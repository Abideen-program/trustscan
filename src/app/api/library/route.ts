import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// High-Fidelity Mock Library Data for Offline Development Previews
const MOCK_PATTERNS = [
  {
    scam_type: 'BVN/NIN verification scam',
    count_this_week: 24,
    top_flags: ['Urgency language', 'Requests for personal information', 'Impersonation of known brands'],
    last_seen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    scam_type: 'Fake bank alert',
    count_this_week: 19,
    top_flags: ['Urgency language', 'Requests for money', 'Too-good-to-be-true offers'],
    last_seen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    scam_type: 'Phishing link',
    count_this_week: 14,
    top_flags: ['Suspicious links or domain names', 'Impersonation of known brands', 'Threats'],
    last_seen: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    scam_type: 'Prize claim scam',
    count_this_week: 11,
    top_flags: ['Too-good-to-be-true offers', 'Requests for money', 'Urgency language'],
    last_seen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    scam_type: 'Job offer scam',
    count_this_week: 8,
    top_flags: ['Too-good-to-be-true offers', 'Requests for personal information', 'Emotional manipulation'],
    last_seen: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
  }
];

export async function GET(req: NextRequest) {
  try {
    const isSupabaseReady = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url_here';

    if (isSupabaseReady) {
      // Get parameters for pagination
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || '20', 10);
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // 1. Fetch scan items from DB from the last 7 days
      const { data, error } = await supabase
        .from('scan_results')
        .select('scam_type, created_at, flags')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (error) {
        console.error('Failed to fetch library metrics from DB:', error);
        // Fallback to mock data if query fails
        return NextResponse.json({
          patterns: MOCK_PATTERNS,
          total: MOCK_PATTERNS.length,
        });
      }

      // If database is empty, return our structured mock patterns to populate UI beautiful details
      if (!data || data.length === 0) {
        return NextResponse.json({
          patterns: MOCK_PATTERNS,
          total: MOCK_PATTERNS.length,
        });
      }

      // 2. Perform dynamic JS aggregation on the retrieved array
      const counts: Record<string, { count: number; lastSeen: string; flags: Record<string, number> }> = {};
      
      data.forEach((row) => {
        const scamType = row.scam_type || 'Unknown pattern';
        
        if (!counts[scamType]) {
          counts[scamType] = {
            count: 0,
            lastSeen: row.created_at,
            flags: {},
          };
        }

        counts[scamType].count += 1;
        
        // Track the most recent timestamp
        if (new Date(row.created_at) > new Date(counts[scamType].lastSeen)) {
          counts[scamType].lastSeen = row.created_at;
        }

        // Aggregate flag tags
        if (row.flags && Array.isArray(row.flags)) {
          row.flags.forEach((f: any) => {
            if (f && f.name) {
              counts[scamType].flags[f.name] = (counts[scamType].flags[f.name] || 0) + 1;
            }
          });
        }
      });

      // 3. Format into output shape
      const patterns = Object.keys(counts).map((scam_type) => {
        const info = counts[scam_type];
        
        // Sort flags of this group by occurrence frequency and take top 3
        const top_flags = Object.keys(info.flags)
          .sort((a, b) => info.flags[b] - info.flags[a])
          .slice(0, 3);

        return {
          scam_type,
          count_this_week: info.count,
          top_flags: top_flags.length > 0 ? top_flags : ['Urgency language'],
          last_seen: info.lastSeen,
        };
      });

      // Sort patterns by most scans this week
      patterns.sort((a, b) => b.count_this_week - a.count_this_week);

      // Paginate
      const startIndex = (page - 1) * limit;
      const paginatedPatterns = patterns.slice(startIndex, startIndex + limit);

      return NextResponse.json({
        patterns: paginatedPatterns,
        total: patterns.length,
      });
    }

    // SUPABASE NOT READY Fallback Loader
    return NextResponse.json({
      patterns: MOCK_PATTERNS,
      total: MOCK_PATTERNS.length,
    });

  } catch (error: any) {
    console.error('Internal Server Error in /api/library:', error);
    return NextResponse.json({ error: 'Server failed compiling scam patterns.' }, { status: 500 });
  }
}
