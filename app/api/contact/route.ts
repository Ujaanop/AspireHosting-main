import { NextRequest, NextResponse } from 'next/server'
import { dbGet, dbSet } from '@/lib/db'
import { verifyAdmin } from '@/lib/verifyAdmin'

const MESSAGES_KEY = 'contact_messages'
const MESSAGES_FILE = 'app/config/contact-messages.json'

async function readMessages() {
  const data = await dbGet<{ messages: unknown[] }>(MESSAGES_KEY, MESSAGES_FILE)
  return data ?? { messages: [] }
}

async function writeMessages(data: unknown) {
  await dbSet(MESSAGES_KEY, data, MESSAGES_FILE)
}

// POST — public, submit a contact message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      read: false,
      receivedAt: new Date().toISOString(),
    }

    const data = await readMessages()
    ;(data.messages as unknown[]).unshift(newMessage)
    await writeMessages(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// GET — admin only
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username') ?? ''
  const password = searchParams.get('password') ?? ''

  if (!await verifyAdmin(username, password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await readMessages()
  return NextResponse.json(data)
}

// PATCH — mark read/unread or mark all read (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id, read, markAllRead } = body

    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await readMessages()
    const messages = data.messages as { id: string; read: boolean }[]

    if (markAllRead) {
      data.messages = messages.map((m) => ({ ...m, read: true }))
    } else {
      const idx = messages.findIndex((m) => m.id === id)
      if (idx === -1) return NextResponse.json({ error: 'Message not found' }, { status: 404 })
      messages[idx].read = read ?? true
    }

    await writeMessages(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// DELETE — remove message (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id } = body

    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await readMessages()
    const messages = data.messages as { id: string }[]
    const before = messages.length
    data.messages = messages.filter((m) => m.id !== id)

    if ((data.messages as unknown[]).length === before) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    await writeMessages(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
