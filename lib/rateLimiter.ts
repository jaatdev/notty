/**
 * lib/rateLimiter.ts
 * Token-bucket rate limiter with optional Redis/Upstash backing.
 * - In-memory mode: fast, fine for dev/single instance
 * - Redis mode: global across multiple serverless instances (production)
 */

type LimitResult = { ok: true; remaining: number } | { ok: false; retryAfterMs: number };

//////////////////////////
// In-memory token bucket
//////////////////////////
const MEMORY_BUCKETS = new Map<string, { tokens: number; lastRefill: number }>();

/**
 * rateLimitInMemory - token-bucket algorithm
 * @param key unique key to rate-limit (e.g. `heartbeat:noteKey:userId`)
 * @param capacity total tokens in bucket (default 6)
 * @param refillIntervalMs refill interval in ms (default 1000 ms = 1 second)
 * @param refillAmount tokens added each refill (default 1)
 */
export function rateLimitInMemory(
  key: string,
  capacity = 6,
  refillIntervalMs = 1000,
  refillAmount = 1
): LimitResult {
  const now = Date.now();
  let bucket = MEMORY_BUCKETS.get(key);
  if (!bucket) {
    bucket = { tokens: capacity, lastRefill: now };
    MEMORY_BUCKETS.set(key, bucket);
  }

  // refill based on elapsed time
  const elapsed = now - bucket.lastRefill;
  const steps = Math.floor(elapsed / refillIntervalMs);
  if (steps > 0) {
    bucket.tokens = Math.min(capacity, bucket.tokens + steps * refillAmount);
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return { ok: true, remaining: bucket.tokens };
  }
  return { ok: false, retryAfterMs: refillIntervalMs };
}

//////////////////////////////////////////////////////
// Optional Redis/Upstash implementation
//////////////////////////////////////////////////////
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function upstashFetch(body: any) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) throw new Error('Upstash not configured');
  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

/**
 * rateLimitRedis - global rate limiting using Upstash REST API
 * Atomic counter with TTL per window
 */
export async function rateLimitRedis(
  key: string,
  capacity = 10,
  windowSeconds = 60
): Promise<LimitResult> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    // fallback to in-memory if not configured
    return rateLimitInMemory(key, Math.max(1, Math.floor(capacity / 2)));
  }

  const redisKey = `rl:${key}`;

  try {
    const cmdBody = {
      cmds: [
        ['INCR', redisKey],
        ['TTL', redisKey],
      ],
    };

    const json = await upstashFetch(cmdBody);
    const incrRes = json?.result?.[0] ?? null;
    const ttlRes = json?.result?.[1] ?? null;

    const count = Number(incrRes ?? NaN);
    if (isNaN(count)) return { ok: true, remaining: capacity };

    // If TTL < 0 (no expiry set), set it now
    if (!ttlRes || Number(ttlRes) < 0) {
      await upstashFetch({ cmds: [['EXPIRE', redisKey, String(windowSeconds)]] });
    }

    if (count <= capacity) {
      return { ok: true, remaining: capacity - count };
    }
    return { ok: false, retryAfterMs: windowSeconds * 1000 };
  } catch (err) {
    console.error('Rate limit Redis error:', err);
    // be permissive on error
    return { ok: true, remaining: capacity };
  }
}

//////////////////////
// Helper: pick key from request
//////////////////////
export function rateLimitKeyFromRequest(req: any, fallback = 'global') {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || fallback;
  return `ip:${ip}`;
}

export default {
  inMemory: rateLimitInMemory,
  redis: rateLimitRedis,
  pickKey: rateLimitKeyFromRequest,
};
