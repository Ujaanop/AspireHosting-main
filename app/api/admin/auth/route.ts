import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/verifyAdmin'

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
