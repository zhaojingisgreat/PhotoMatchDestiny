/**
 * 请求限流工具
 * 基于内存的简单限流实现（适用于单实例）
 * 生产环境建议使用 Redis 或 Vercel KV
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// 内存存储（注意：Vercel Serverless 环境中每次请求可能是新实例）
const limitStore = new Map<string, RateLimitEntry>();

// 清理过期记录（每小时执行一次）
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limitStore.entries()) {
    if (now > entry.resetAt) {
      limitStore.delete(key);
    }
  }
}, 3600000);

export interface RateLimitConfig {
  /**
   * 时间窗口内允许的最大请求数
   */
  maxRequests: number;

  /**
   * 时间窗口（毫秒）
   */
  windowMs: number;
}

export interface RateLimitResult {
  /**
   * 是否被限流
   */
  limited: boolean;

  /**
   * 剩余请求次数
   */
  remaining: number;

  /**
   * 限流重置时间（毫秒时间戳）
   */
  resetAt: number;

  /**
   * 距离重置还有多少秒
   */
  retryAfter?: number;
}

/**
 * 检查请求是否超出限流
 * @param identifier 唯一标识符（通常是 IP 地址）
 * @param config 限流配置
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = limitStore.get(identifier);

  // 如果没有记录或已过期，创建新记录
  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    limitStore.set(identifier, newEntry);

    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // 增加计数
  entry.count++;

  // 检查是否超出限制
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

    return {
      limited: true,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter,
    };
  }

  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * 从请求中获取客户端 IP
 */
export function getClientIP(request: Request): string {
  // Vercel 提供的真实 IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // 其他代理头
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Cloudflare
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // 降级方案
  return 'unknown';
}

/**
 * 创建限流响应
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: '请求过于频繁，请稍后再试',
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
        'Retry-After': result.retryAfter?.toString() || '60',
      },
    }
  );
}
