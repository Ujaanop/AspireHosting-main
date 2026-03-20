import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const MESSAGES_PATH = path.join(process.cwd(), 'app', 'config', 'contact-messages.json')
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

async function readMessages() {
  try {
    const raw = await fs.readFile(MESSAGES_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { messages: [] }
  }
}

async function writeMessages(data: unknown) {
  await fs.writeFile(MESSAGES_PATH, JSON.stringify(data, null, 2), 'utf-8')
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
    data.messages.unshift(newMessage)
    await writeMessages(data)

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// GET — admin only, returns all messages
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

// PATCH — admin only, mark message as read/unread or bulk mark-all-read
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id, read, markAllRead } = body

    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await readMessages()

    if (markAllRead) {
      data.messages = data.messages.map((m: { read: boolean }) => ({ ...m, read: true }))
    } else {
      const idx = data.messages.findIndex((m: { id: string }) => m.id === id)
      if (idx === -1) return NextResponse.json({ error: 'Message not found' }, { status: 404 })
      data.messages[idx].read = read ?? true
    }

    await writeMessages(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// DELETE — admin only, delete a message
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id } = body

    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await readMessages()
    const before = data.messages.length
    data.messages = data.messages.filter((m: { id: string }) => m.id !== id)

    if (data.messages.length === before) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    await writeMessages(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
