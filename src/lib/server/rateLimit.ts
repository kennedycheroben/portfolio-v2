/**
 * In-memory sliding window rate limiter for production and local server runtimes.
 * Prevents brute-forcing on admin login and spam submissions on contact inquiries.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let cleanupTimer: NodeJS.Timeout | null = null;

function ensureCleanupTimer() {
  if (!cleanupTimer && typeof setInterval !== "undefined") {
    cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, record] of rateLimitStore.entries()) {
        record.timestamps = record.timestamps.filter((t) => now - t < 30 * 60 * 1000);
        if (record.timestamps.length === 0) {
          rateLimitStore.delete(key);
        }
      }
    }, CLEANUP_INTERVAL_MS);
    if (cleanupTimer.unref) {
      cleanupTimer.unref();
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds: number;
}

/**
 * Checks whether an action by a given key is within the specified rate limit.
 *
 * @param key Unique key for the rate-limit bucket (e.g. `login:192.168.1.1`)
 * @param maxRequests Maximum allowed requests in the time window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  ensureCleanupTimer();

  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Retain only timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    rateLimitStore.set(key, record);
    return {
      allowed: false,
      remaining: 0,
      limit: maxRequests,
      retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    limit: maxRequests,
    retryAfterSeconds: 0,
  };
}

/**
 * Extracts a normalized client IP address from request headers or socket.
 */
export function getClientIp(req: {
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || "127.0.0.1";
}

/**
 * Resets all rate limits (for testing purposes).
 */
export function resetRateLimits(): void {
  rateLimitStore.clear();
}
