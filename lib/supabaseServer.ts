// lib/supabaseServer.ts
// Server-side Supabase client helper
// Creates client on-demand to avoid build-time initialization errors

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with service role key for server-side operations.
 * Returns null if environment variables are missing (safe for build time).
 */
export function createServerSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase server configuration missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}
