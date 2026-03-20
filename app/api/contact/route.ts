import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { verifyAdmin } from '@/lib/verifyAdmin'

const MESSAGES_PATH = path.join(process.cwd(), 'app', 'config', 'contact-messages.json')

async function readMessages() {
  try {
    return JSON.parse(await fs.readFile(MESSAGES_PATH, 'utf-8'))
  } catch { return { messages: [] } }
}

async function writeMessages(data: unknown) {
  await fs.writeFile(MESSAGES_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT ?? '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

async function sendEmailNotification(name: string, email: string, subject: string, message: string) {
  const transporter = createTransporter()
  if (!transporter) return // SMTP not configured, silently skip

  const toEmail = process.env.SMTP_TO ?? process.env.SMTP_USER ?? 'support@aspirehosting.net'

  await transporter.sendMail({
    from: `"AspireHosting Contact" <${process.env.SMTP_USER}>`,
    replyTo: `"${name}" <${email}>`,
    to: toEmail,
    subject: `[Contact Form] ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 8px;">
        <h2 style="color: #111827; margin-bottom: 4px;">New Contact Message</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">From your AspireHosting website contact form</p>

        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 12px 16px; font-weight: 600; color: #374151; background: #f3f4f6; width: 30%; border-bottom: 1px solid #e5e7eb;">Name</td>
            <td style="padding: 12px 16px; color: #111827; border-bottom: 1px solid #e5e7eb;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: 600; color: #374151; background: #f3f4f6; border-bottom: 1px solid #e5e7eb;">Email</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: 600; color: #374151; background: #f3f4f6; border-bottom: 1px solid #e5e7eb;">Subject</td>
            <td style="padding: 12px 16px; color: #111827; border-bottom: 1px solid #e5e7eb;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: 600; color: #374151; background: #f3f4f6; vertical-align: top;">Message</td>
            <td style="padding: 12px 16px; color: #111827; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; text-align: center;">
          Reply directly to this email to respond to ${name}
        </p>
      </div>
    `,
    text: `New contact message from ${name} (${email})\n\nSubject: ${subject}\n\n${message}`,
  })
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()
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

    // Save to JSON file
    const data = await readMessages()
    data.messages.unshift(newMessage)
    await writeMessages(data)

    // Send email notification (non-blocking — don't fail if SMTP errors)
    try {
      await sendEmailNotification(newMessage.name, newMessage.email, newMessage.subject, newMessage.message)
    } catch (emailErr) {
      console.error('SMTP send failed (message still saved):', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (!await verifyAdmin(searchParams.get('username') ?? '', searchParams.get('password') ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await readMessages())
}

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
    if (data.messages.length === before) return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    await writeMessages(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
