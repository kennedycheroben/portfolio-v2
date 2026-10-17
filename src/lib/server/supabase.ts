import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-Side Supabase Client Manager
 *
 * Privileged keys (SUPABASE_SERVICE_ROLE_KEY) are kept strictly server-side
 * and NEVER exposed to client-side bundles or VITE_* prefixes.
 */

export interface SupabaseConfig {
  url: string;
  key: string;
  isServiceRole: boolean;
}

let cachedClient: SupabaseClient | null = null;
let mockClient: SupabaseClient | null = null;

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

  // Prefer server-only service-role key; fallback to anon key if provided
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const key = serviceRoleKey || anonKey;

  if (!url || !key || !url.startsWith("https://") || key.length < 20) {
    return null;
  }

  return {
    url: url.trim(),
    key: key.trim(),
    isServiceRole: Boolean(serviceRoleKey && serviceRoleKey.length > 20),
  };
}

export function isSupabaseConfigured(): boolean {
  return mockClient !== null || getSupabaseConfig() !== null;
}

export function getSupabaseClient(): SupabaseClient {
  if (mockClient) {
    return mockClient;
  }

  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase database is unconfigured. Required environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY) are missing or invalid."
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(config.url, config.key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}

/**
 * Allows injecting a mock Supabase client for unit and integration testing.
 */
export function setMockSupabaseClient(client: SupabaseClient | null): void {
  mockClient = client;
}
