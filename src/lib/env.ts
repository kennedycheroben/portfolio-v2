import { z } from "zod";

const envSchema = z.object({
  VITE_SITE_URL: z.string().url().default("https://portfolio.kennedycheroben.co.ke"),
  VITE_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  VITE_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  VITE_TURNSTILE_SITE_KEY: z.string().optional().or(z.literal("")),
});

/**
 * Validated client environment variables.
 * Safe defaults are provided to ensure prerendering and tests run without failure.
 */
function parseEnv() {
  const rawEnv = {
    VITE_SITE_URL: import.meta.env?.VITE_SITE_URL || "https://portfolio.kennedycheroben.co.ke",
    VITE_SUPABASE_URL: import.meta.env?.VITE_SUPABASE_URL || "",
    VITE_SUPABASE_ANON_KEY: import.meta.env?.VITE_SUPABASE_ANON_KEY || "",
    VITE_TURNSTILE_SITE_KEY: import.meta.env?.VITE_TURNSTILE_SITE_KEY || "",
  };

  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    console.warn("Environment variable validation warnings:", parsed.error.format());
    return {
      VITE_SITE_URL: "https://portfolio.kennedycheroben.co.ke",
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
      VITE_TURNSTILE_SITE_KEY: "",
    };
  }

  return parsed.data;
}

export const env = parseEnv();
