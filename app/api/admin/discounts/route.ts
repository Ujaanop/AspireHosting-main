import { NextRequest, NextResponse } from 'next/server'
import { dbGet, dbSet } from '@/lib/db'

const ADMINS_KEY = 'admins'
const ADMINS_FILE = 'app/config/sections/statusAdmins.json'
const DISCOUNTS_KEY = 'discounts'
const DISCOUNTS_FILE = 'app/config/discounts.json'
const BANNER_KEY = 'banner'
const NAV_FILE = 'app/config/sections/navigation.json'

async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const data = await dbGet<{ admins: { username: string; password: string }[] }>(ADMINS_KEY, ADMINS_FILE)
    return (data?.admins ?? []).some(
      (a) => a.username === username && a.password === password
    )
  } catch { return false }
}

// GET — public, returns discounts config + banner
export async function GET() {
  try {
    const [discounts, navData] = await Promise.all([
      dbGet(DISCOUNTS_KEY, DISCOUNTS_FILE),
      dbGet<{ banner: unknown }>(BANNER_KEY, NAV_FILE),
    ])
    // When falling back to nav file locally, banner is nested under .banner
    const banner = (navData as { banner?: unknown })?.banner ?? navData ?? {}
    return NextResponse.json({ discounts, banner })
  } catch {
    return NextResponse.json({ discounts: {}, banner: {} })
  }
}

// PATCH — update discounts and/or banner (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, discounts, banner } = body

    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (discounts) {
      await dbSet(DISCOUNTS_KEY, discounts, DISCOUNTS_FILE)
    }

    if (banner !== undefined) {
      if (process.env.KV_REST_API_URL) {
        // On KV: store banner directly
        const existing = await dbGet<Record<string, unknown>>(BANNER_KEY, NAV_FILE) ?? {}
        await dbSet(BANNER_KEY, { ...existing, ...banner }, NAV_FILE)
      } else {
        // Locally: merge into navigation.json under .banner
        const nav = await dbGet<{ banner: Record<string, unknown> }>(BANNER_KEY, NAV_FILE) ?? { banner: {} }
        nav.banner = { ...nav.banner, ...banner }
        await dbSet(BANNER_KEY, nav, NAV_FILE)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
