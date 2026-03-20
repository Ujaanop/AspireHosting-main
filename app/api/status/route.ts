import { NextRequest, NextResponse } from 'next/server'
import net from 'net'

function tcpCheck(
  host: string,
  port: number,
  timeoutMs: number
): Promise<{ online: boolean; latencyMs: number | null }> {
  return new Promise((resolve) => {
    const start = Date.now()
    const socket = net.createConnection({ host, port })

    const timer = setTimeout(() => {
      socket.destroy()
      resolve({ online: false, latencyMs: null })
    }, timeoutMs)

    socket.on('connect', () => {
      clearTimeout(timer)
      socket.destroy()
      resolve({ online: true, latencyMs: Date.now() - start })
    })

    socket.on('error', () => {
      clearTimeout(timer)
      resolve({ online: false, latencyMs: null })
    })
  })
}

export async function POST(req: NextRequest) {
  try {
    const { url, type } = await req.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 })
    }

    const trimmed = url.trim()

    // Determine if this is an IP check (either explicit type or auto-detect)
    const isIp =
      type === 'ip' || /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(trimmed)

    if (isIp) {
      // Parse host and port from "1.2.3.4" or "1.2.3.4:8080"
      const colonIdx = trimmed.lastIndexOf(':')
      const hasDotBeforeColon =
        colonIdx !== -1 && trimmed.slice(0, colonIdx).includes('.')
      const host =
        colonIdx !== -1 && hasDotBeforeColon
          ? trimmed.slice(0, colonIdx)
          : trimmed
      const explicitPort =
        colonIdx !== -1 && hasDotBeforeColon
          ? parseInt(trimmed.slice(colonIdx + 1), 10)
          : null

      let result: { online: boolean; latencyMs: number | null }

      if (explicitPort !== null) {
        // User specified a port — check only that port
        result = await tcpCheck(host, explicitPort, 5000)
      } else {
        // No port specified — probe common ports in parallel; online if any one connects
        // Covers: SSH (22), HTTP (80), HTTPS (443), Proxmox (8006)
        const PROBE_PORTS = [22, 80, 443, 8006]
        const results = await Promise.all(
          PROBE_PORTS.map((p) => tcpCheck(host, p, 5000))
        )
        const first = results.find((r) => r.online)
        result = first ?? { online: false, latencyMs: null }
      }

      return NextResponse.json({
        online: result.online,
        latencyMs: result.latencyMs,
        statusCode: null,
        error: result.online ? undefined : 'No open ports found (tried 22, 80, 443, 8006)',
        checkedAt: Date.now(),
      })
    }

    // HTTP/domain check — existing behaviour
    const targetUrl = trimmed.startsWith('http')
      ? trimmed
      : `https://${trimmed}`

    const start = Date.now()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const res = await fetch(targetUrl, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      })
      clearTimeout(timeout)
      const latencyMs = Date.now() - start
      const online = res.status < 500

      return NextResponse.json({
        online,
        latencyMs,
        statusCode: res.status,
        checkedAt: Date.now(),
      })
    } catch (fetchErr: unknown) {
      clearTimeout(timeout)
      const latencyMs = Date.now() - start
      const isTimeout =
        fetchErr instanceof Error && fetchErr.name === 'AbortError'
      return NextResponse.json({
        online: false,
        latencyMs: isTimeout ? null : latencyMs,
        statusCode: null,
        error: isTimeout ? 'Request timed out' : 'Unreachable',
        checkedAt: Date.now(),
      })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
