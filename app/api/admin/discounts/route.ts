import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { verifyAdmin } from '@/lib/verifyAdmin'

const DISCOUNTS_PATH = path.join(process.cwd(), 'app', 'config', 'discounts.json')
const NAV_PATH = path.join(process.cwd(), 'app', 'config', 'sections', 'navigation.json')

export async function GET() {
  try {
    const [discRaw, navRaw] = await Promise.all([fs.readFile(DISCOUNTS_PATH, 'utf-8'), fs.readFile(NAV_PATH, 'utf-8')])
    return NextResponse.json({ discounts: JSON.parse(discRaw), banner: JSON.parse(navRaw).banner ?? {} })
  } catch {
    return NextResponse.json({ discounts: {}, banner: {} })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, discounts, banner } = body
    if (!await verifyAdmin(username, password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (discounts) await fs.writeFile(DISCOUNTS_PATH, JSON.stringify(discounts, null, 2), 'utf-8')
    if (banner !== undefined) {
      const nav = JSON.parse(await fs.readFile(NAV_PATH, 'utf-8'))
      nav.banner = { ...nav.banner, ...banner }
      await fs.writeFile(NAV_PATH, JSON.stringify(nav, null, 2), 'utf-8')
    }
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
