/**
 * db.ts — unified storage abstraction
 *
 * • On Vercel (KV_REST_API_URL is set) → uses @vercel/kv (Redis)
 * • Locally (no KV env)               → falls back to JSON files on disk
 *
 * This means local dev keeps working with zero extra setup, and
 * production on Vercel uses persistent KV storage.
 */

import { promises as fs } from 'fs'
import path from 'path'

const USE_KV = !!process.env.KV_REST_API_URL

// Lazy-load kv so it doesn't crash in local dev where the env vars aren't set
async function getKv() {
  const { kv } = await import('@vercel/kv')
  return kv
}

function filePath(relativePath: string) {
  return path.join(process.cwd(), relativePath)
}

export async function dbGet<T>(key: string, fallbackFile: string): Promise<T | null> {
  if (USE_KV) {
    const kv = await getKv()
    return kv.get<T>(key)
  }
  try {
    const raw = await fs.readFile(filePath(fallbackFile), 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function dbSet(key: string, value: unknown, fallbackFile: string): Promise<void> {
  if (USE_KV) {
    const kv = await getKv()
    await kv.set(key, value)
    return
  }
  await fs.writeFile(filePath(fallbackFile), JSON.stringify(value, null, 2), 'utf-8')
}
