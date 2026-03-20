/**
 * db.ts — unified storage abstraction
 *
 * • On Vercel (Upstash Redis env vars set) → uses @upstash/redis
 * • Locally (no Redis env vars)            → falls back to JSON files on disk
 *
 * Supports both old KV_REST_API_* and new UPSTASH_REDIS_REST_* variable names.
 */

import { promises as fs } from 'fs'
import path from 'path'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const USE_REDIS = !!(REDIS_URL && REDIS_TOKEN)

async function getRedis() {
  const { Redis } = await import('@upstash/redis')
  return new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! })
}

function filePath(relativePath: string) {
  return path.join(process.cwd(), relativePath)
}

export async function dbGet<T>(key: string, fallbackFile: string): Promise<T | null> {
  if (USE_REDIS) {
    const redis = await getRedis()
    return redis.get<T>(key)
  }
  try {
    const raw = await fs.readFile(filePath(fallbackFile), 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function dbSet(key: string, value: unknown, fallbackFile: string): Promise<void> {
  if (USE_REDIS) {
    const redis = await getRedis()
    await redis.set(key, value)
    return
  }
  await fs.writeFile(filePath(fallbackFile), JSON.stringify(value, null, 2), 'utf-8')
}
