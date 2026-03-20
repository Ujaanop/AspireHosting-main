import { NextRequest, NextResponse } from 'next/server'
import { dbGet } from '@/lib/db'

interface AdminEntry { username: string; password: string }

async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const data = await dbGet<{ admins: AdminEntry[] }>(
      'admins',
      'app/config/sections/statusAdmins.json'
    )
    return (data?.admins ?? []).some(
      (a) => a.username === username && a.password === password
    )
  } catch { return false }
}

export { verifyAdmin }

// POST — verify credentials (read-only, works on Vercel)
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }
    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
