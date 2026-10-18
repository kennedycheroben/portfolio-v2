import crypto from "node:crypto";

export interface AdminSession {
  userId: string;
  email: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
  supabaseToken?: string;
  supabaseRefreshToken?: string;
}

export interface AuthConfig {
  secret: string;
  email: string;
  password: string;
}

/**
 * Validates and retrieves server authentication configuration from environment.
 * FAILS CLOSED: Returns null if any required secret or credential variable is missing or insecure.
 */
export function getAuthConfig(): AuthConfig | null {
  const secret = process.env.ADMIN_AUTH_SECRET;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!secret || typeof secret !== "string" || secret.trim().length < 16) {
    return null;
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return null;
  }
  if (!password || typeof password !== "string" || password.trim().length < 8) {
    return null;
  }

  return {
    secret: secret.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
  };
}

export function isAuthConfigured(): boolean {
  return getAuthConfig() !== null;
}

/**
 * Issues an HMAC SHA-256 signed administrative bearer session token.
 * Throws if the server is unconfigured to fail closed.
 */
export function createAdminToken(
  email: string,
  options?: {
    userId?: string;
    supabaseToken?: string;
    supabaseRefreshToken?: string;
  }
): string {
  const config = getAuthConfig();
  if (!config) {
    throw new Error(
      "Authentication service is unconfigured. Required environment variables (ADMIN_AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD) are missing."
    );
  }

  const issuedAt = Date.now();
  const expiresAt = issuedAt + 24 * 60 * 60 * 1000; // 24 hours
  const payload = JSON.stringify({
    userId: options?.userId || "admin-master-id",
    email: email.trim().toLowerCase(),
    role: "admin",
    issuedAt,
    expiresAt,
    supabaseToken: options?.supabaseToken,
    supabaseRefreshToken: options?.supabaseRefreshToken,
  });

  const b64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", config.secret)
    .update(b64Payload)
    .digest("base64url");

  return `${b64Payload}.${signature}`;
}

/**
 * Cryptographically verifies an administrative session token using constant-time comparisons.
 * Fails closed if token is invalid, expired, tampered, or server secrets are absent.
 */
export function verifyAdminToken(token: string | null | undefined): AdminSession | null {
  if (!token || typeof token !== "string") return null;

  const config = getAuthConfig();
  if (!config) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [b64Payload, signature] = parts;
  if (!b64Payload || !signature) return null;

  const expectedSig = crypto
    .createHmac("sha256", config.secret)
    .update(b64Payload)
    .digest("base64url");

  // Constant-time comparison using fixed-length SHA-256 digests to prevent RangeError buffer length leaks
  const sigHash = crypto.createHash("sha256").update(signature).digest();
  const expectedSigHash = crypto.createHash("sha256").update(expectedSig).digest();

  if (!crypto.timingSafeEqual(sigHash, expectedSigHash)) {
    return null;
  }

  try {
    const raw = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const session = JSON.parse(raw) as AdminSession;

    if (!session || session.role !== "admin" || !session.expiresAt) {
      return null;
    }

    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Validates administrator credentials using timing-safe comparisons.
 * FAILS CLOSED: Returns false if environment variables are not configured.
 */
export function validateAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass || typeof email !== "string" || typeof pass !== "string") {
    return false;
  }

  const config = getAuthConfig();
  if (!config) {
    return false;
  }

  // Digest inputs with SHA-256 before timingSafeEqual to ensure fixed-width 32-byte buffers and prevent timing attacks
  const emailInputHash = crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest();
  const emailTargetHash = crypto
    .createHash("sha256")
    .update(config.email)
    .digest();
  const emailMatches = crypto.timingSafeEqual(emailInputHash, emailTargetHash);

  const passInputHash = crypto
    .createHash("sha256")
    .update(pass.trim())
    .digest();
  const passTargetHash = crypto
    .createHash("sha256")
    .update(config.password)
    .digest();
  const passMatches = crypto.timingSafeEqual(passInputHash, passTargetHash);

  return emailMatches && passMatches;
}
