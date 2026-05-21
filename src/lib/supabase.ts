import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

// Validate URL structure; fallback to a valid placeholder structure for build-time safety
const supabaseUrl = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
  ? rawUrl
  : 'https://placeholder.supabase.co';

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
