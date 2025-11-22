// lib/buildSafeSupabase.ts
// Build-safe Supabase client creation
// Returns null during build to prevent initialization errors

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Check if we're in build mode
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

/**
 * Creates a Supabase client that's safe for build time.
 * Returns null during build, actual client at runtime.
 */
export function createBuildSafeSupabaseClient(
  url: string | undefined,
  key: string | undefined
): SupabaseClient | null {
  // Skip during build
  if (isBuildTime || !url || !key) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// Pre-configured server client
let serverClient: SupabaseClient | null = null;

export function getServerSupabaseClient(): SupabaseClient | null {
  if (isBuildTime) return null;
  
  if (serverClient) return serverClient;
  
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) return null;
  
  serverClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  
  return serverClient;
}
