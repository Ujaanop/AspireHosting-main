import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DISCOUNTS_PATH = path.join(process.cwd(), 'app', 'config', 'discounts.json')
const NAV_PATH = path.join(process.cwd(), 'app', 'config', 'sections', 'navigation.json')
const ADMINS_PATH = path.join(process.cwd(), 'app', 'config', 'sections', 'statusAdmins.json')

async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const raw = await fs.readFile(ADMINS_PATH, 'utf-8')
    const data = JSON.parse(raw)
    return (data.admins ?? []).some(
      (a: { username: string; password: string }) =>
        a.username === username && a.password === password
    )
  } catch { return false }
}

// GET — public, returns discounts config + banner
export async function GET() {
  try {
    const [discRaw, navRaw] = await Promise.all([
      fs.readFile(DISCOUNTS_PATH, 'utf-8'),
      fs.readFile(NAV_PATH, 'utf-8'),
    ])
    const discounts = JSON.parse(discRaw)
    const nav = JSON.parse(navRaw)
    return NextResponse.json({ discounts, banner: nav.banner ?? {} })
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
      await fs.writeFile(DISCOUNTS_PATH, JSON.stringify(discounts, null, 2), 'utf-8')
    }

    if (banner !== undefined) {
      const navRaw = await fs.readFile(NAV_PATH, 'utf-8')
      const nav = JSON.parse(navRaw)
      nav.banner = { ...nav.banner, ...banner }
      await fs.writeFile(NAV_PATH, JSON.stringify(nav, null, 2), 'utf-8')
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
