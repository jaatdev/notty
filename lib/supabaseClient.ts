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
 * Returns null during SSR/build to prevent initialization errors.
 */
export function getSupabaseClient(): SupabaseClient | null {
  // Only initialize in browser environment
  if (typeof window === 'undefined') return null;
  
  if (global.__supabase_client) return global.__supabase_client;
  
  // Check if env vars are available
  if (!url || !anonKey) {
    console.warn('Supabase env vars missing, returning null client');
    return null;
  }
  
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
