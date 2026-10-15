import crypto from "node:crypto";

const SECRET = process.env.ADMIN_AUTH_SECRET || "portfolio-admin-secret-dev-key-salt-2026";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@kennedycheroben.co.ke";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@Portfolio2026!";

export interface AdminSession {
  userId: string;
  email: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

export function createAdminToken(email: string): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 24 * 60 * 60 * 1000; // 24 hours
  const payload = JSON.stringify({
    userId: "admin-master-id",
    email,
    role: "admin",
    issuedAt,
    expiresAt,
  });

  const b64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(b64Payload)
    .digest("base64url");

  return `${b64Payload}.${signature}`;
}

export function verifyAdminToken(token: string | null | undefined): AdminSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [b64Payload, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(b64Payload)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const raw = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const session = JSON.parse(raw) as AdminSession;
    if (Date.now() > session.expiresAt) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  const normEmail = email.trim().toLowerCase();
  const targetEmail = ADMIN_EMAIL.trim().toLowerCase();
  return normEmail === targetEmail && pass === ADMIN_PASSWORD;
}
