// lib/supabaseClient.ts
// Singleton Supabase client for client-side usage
// Ensures only one GoTrueClient instance (prevents multi-instance warning)
import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare global {
  var __supabase_client: SupabaseClient | undefined;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anonKey) {
  console.warn('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

/**
 * Returns the shared Supabase client instance.
 * Uses global for dev HMR persistence to ensure true singleton.
 * This eliminates "Multiple GoTrueClient instances detected" warning.
 */
export function getSupabaseClient(): SupabaseClient {
  if (global.__supabase_client) return global.__supabase_client;
  
  global.__supabase_client = createClient(url, anonKey, {
    auth: {
      persistSession: false, // Don't persist auth in localStorage (Clerk handles auth)
      storageKey: 'sb:' + (url || '').replace(/[^a-z0-9]/gi, ''),
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
  
  return global.__supabase_client;
}
