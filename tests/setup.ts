import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock matchMedia for jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Ensure unit and component tests run in an isolated test environment
// and never make live network calls to the production Supabase instance
process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "";
process.env.SUPABASE_ANON_KEY = "";
process.env.SUPABASE_SERVICE_ROLE_KEY = "";
process.env.VITE_SUPABASE_URL = "";
process.env.VITE_SUPABASE_ANON_KEY = "";
process.env.ADMIN_AUTH_SECRET = "test-auth-secret-32-characters-minimum-length";
process.env.ADMIN_EMAIL = "admin@example.com";
process.env.ADMIN_PASSWORD = "test-admin-password";
