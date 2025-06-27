import { createServerClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // During build time, if env vars are missing, return a mock client
  if (!supabaseUrl || !supabaseKey) {
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      // Return a mock client for build time
      return {
        from: () => ({
          select: () => ({ order: () => ({ data: [], error: null }) }),
          insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
          update: () => ({ eq: () => ({ data: null, error: null }) }),
          delete: () => ({ eq: () => ({ data: null, error: null }) }),
        }),
      } as any;
    }
    throw new Error('Supabase URL and/or anonymous key are missing. Please check your .env file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
  }

  return createServerClient(supabaseUrl, supabaseKey);
}
