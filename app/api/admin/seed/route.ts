/**
 * /api/admin/seed
 *
 * ONE-TIME setup endpoint. Call this after deploying to Vercel to
 * populate KV with your existing JSON config files.
 *
 * Requires admin credentials. Safe to call again — only writes keys
 * that don't already exist in KV (won't overwrite live data).
 *
 * DELETE this route after seeding if you want (optional).
 */

import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

function file(...parts: string[]) {
  return path.join(process.cwd(), ...parts)
}

async function readJson(filePath: string) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf-8'))
  } catch { return null }
}

export async function POST(req: NextRequest) {
  if (!(process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL)) {
    return NextResponse.json({ error: 'KV not configured — nothing to seed' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { username, password } = body

    // Verify admin from the JSON file (KV may be empty at this point)
    const adminsData = await readJson(file('app', 'config', 'sections', 'statusAdmins.json'))
    const valid = (adminsData?.admins ?? []).some(
      (a: { username: string; password: string }) =>
        a.username === username && a.password === password
    )
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { Redis } = await import('@upstash/redis')
    const kv = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN!,
    })

    const seeds: { key: string; data: unknown }[] = [
      { key: 'admins', data: adminsData },
      { key: 'status_servers', data: await readJson(file('app', 'config', 'sections', 'statusServers.json')) },
      { key: 'blog', data: await readJson(file('app', 'config', 'blog.json')) },
      { key: 'discounts', data: await readJson(file('app', 'config', 'discounts.json')) },
      { key: 'contact_messages', data: await readJson(file('app', 'config', 'contact-messages.json')) },
    ]

    // Read navigation.json and store just the banner object under 'banner' key
    const nav = await readJson(file('app', 'config', 'sections', 'navigation.json'))
    if (nav?.banner) seeds.push({ key: 'banner', data: nav.banner })

    const results: Record<string, string> = {}
    for (const { key, data } of seeds) {
      if (data === null) { results[key] = 'skipped (file not found)'; continue }
      const existing = await kv.get(key)
      if (existing !== null) { results[key] = 'skipped (already in KV)'; continue }
      await kv.set(key, data)
      results[key] = 'seeded'
    }

    return NextResponse.json({ success: true, results })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
