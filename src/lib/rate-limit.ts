// 简单的内存速率限制器
// 生产环境建议使用 Redis (Upstash) 或其他持久化方案

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// 清理过期的限制记录（每小时执行一次）
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 3600000); // 1 小时

/**
 * 检查速率限制
 * @param identifier 用户标识符（通常是用户 ID）
 * @param limit 时间窗口内允许的最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @returns true 如果允许请求，false 如果超过限制
 */
export function checkRateLimit(
    identifier: string,
    limit: number = 10,
    windowMs: number = 3600000 // 默认 1 小时
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const userLimit = rateLimitStore.get(identifier);

    // 如果没有记录或已过期，创建新记录
    if (!userLimit || now > userLimit.resetTime) {
        const resetTime = now + windowMs;
        rateLimitStore.set(identifier, { count: 1, resetTime });
        return { allowed: true, remaining: limit - 1, resetTime };
    }

    // 检查是否超过限制
    if (userLimit.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: userLimit.resetTime,
        };
    }

    // 增加计数
    userLimit.count++;
    return {
        allowed: true,
        remaining: limit - userLimit.count,
        resetTime: userLimit.resetTime,
    };
}

/**
 * 重置特定用户的速率限制（用于测试或管理员操作）
 */
export function resetRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
}

/**
 * 获取当前速率限制状态
 */
export function getRateLimitStatus(identifier: string): RateLimitEntry | null {
    return rateLimitStore.get(identifier) || null;
}
