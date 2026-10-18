import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-Side Supabase Client Manager
 *
 * Privileged keys (SUPABASE_SERVICE_ROLE_KEY) are kept strictly server-side
 * and NEVER exposed to client-side bundles or VITE_* prefixes.
 *
 * Under the hardened RLS architecture:
 * - Public visitor operations use the publishable anon key under RLS.
 * - Authenticated administrator operations forward the admin's verified JWT so RLS
 *   (public.is_admin()) acts as the authoritative database-level gatekeeper.
 * - Optional server-only service-role key operates as superuser bypass when configured.
 */

export interface SupabaseConfig {
  url: string;
  key: string;
  anonKey: string;
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
    anonKey: (anonKey || key).trim(),
    isServiceRole: Boolean(serviceRoleKey && serviceRoleKey.length > 20),
  };
}

export function isSupabaseConfigured(): boolean {
  return mockClient !== null || getSupabaseConfig() !== null;
}

/**
 * Retrieves a Supabase client.
 * If userToken is supplied, returns a client scoped to the authenticated user's JWT,
 * ensuring PostgreSQL Row Level Security (RLS) evaluates `auth.uid()` and `public.is_admin()` correctly.
 */
export function getSupabaseClient(userToken?: string): SupabaseClient {
  if (mockClient) {
    return mockClient;
  }

  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase database is unconfigured. Required environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY) are missing or invalid."
    );
  }

  if (userToken && userToken.trim().length > 0) {
    // Authenticated caller: send user JWT in Authorization header so PostgREST enforces RLS for this user
    return createClient(config.url, config.anonKey || config.key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${userToken.trim()}`,
        },
      },
    });
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
 * Returns an unprivileged Supabase client using the public anon key.
 * Used for public reads and invoking public RPCs (e.g. submit_contact_inquiry).
 */
export function getSupabaseAnonClient(): SupabaseClient {
  if (mockClient) {
    return mockClient;
  }

  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase database is unconfigured.");
  }

  return createClient(config.url, config.anonKey || config.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Allows injecting a mock Supabase client for unit and integration testing.
 */
export function setMockSupabaseClient(client: SupabaseClient | null): void {
  mockClient = client;
}

/**
 * Resets cached clients (for testing or configuration reloads).
 */
export function resetSupabaseClientCache(): void {
  cachedClient = null;
  mockClient = null;
}
