import { Redis } from '@upstash/redis'

// Upstash Redis client (serverless-friendly)
// If UPSTASH_REDIS_REST_URL not set, fallback to in-memory cache
let redis: Redis | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

// In-memory fallback cache
type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private maxSize = 100

  set<T>(key: string, data: T, ttlSeconds: number = 300) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
}

const memoryCache = new MemoryCache()

// Unified cache interface
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (redis) {
      try {
        const data = await redis.get<T>(key)
        return data
      } catch (error) {
        console.error('Redis get error:', error)
        return memoryCache.get<T>(key)
      }
    }
    return memoryCache.get<T>(key)
  },

  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    if (redis) {
      try {
        await redis.set(key, value, { ex: ttlSeconds })
      } catch (error) {
        console.error('Redis set error:', error)
        memoryCache.set(key, value, ttlSeconds)
      }
    } else {
      memoryCache.set(key, value, ttlSeconds)
    }
  },

  async delete(key: string): Promise<void> {
    if (redis) {
      try {
        await redis.del(key)
      } catch (error) {
        console.error('Redis delete error:', error)
      }
    }
    memoryCache.delete(key)
  },

  async clear(): Promise<void> {
    if (redis) {
      try {
        await redis.flushdb()
      } catch (error) {
        console.error('Redis clear error:', error)
      }
    }
    memoryCache.clear()
  },

  // Rate limiting
  async rateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    if (redis) {
      try {
        const current = await redis.incr(key)
        if (current === 1) {
          await redis.expire(key, windowSeconds)
        }
        return current <= maxRequests
      } catch (error) {
        console.error('Redis rate limit error:', error)
        return true // Fail open
      }
    }
    
    // Fallback to memory
    const record = memoryCache.get<{ count: number; resetTime: number }>(key)
    const now = Date.now()
    
    if (!record || now > record.resetTime) {
      memoryCache.set(key, { count: 1, resetTime: now + windowSeconds * 1000 }, windowSeconds)
      return true
    }
    
    if (record.count >= maxRequests) return false
    
    record.count++
    memoryCache.set(key, record, windowSeconds)
    return true
  }
}
