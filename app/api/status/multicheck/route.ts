import { NextRequest, NextResponse } from 'next/server'

const POLL_ATTEMPTS = 4
const POLL_DELAY_MS = 2000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface CheckHostNode {
  [nodeId: string]: unknown[] | null
}

export async function GET(req: NextRequest) {
  const host = req.nextUrl.searchParams.get('host')
  const type = req.nextUrl.searchParams.get('type') ?? 'http' // 'http' | 'ip'

  if (!host) {
    return NextResponse.json({ error: 'Missing host param' }, { status: 400 })
  }

  const isIp = type === 'ip'

  // For IP checks ensure host includes a port (check-host.net requires it for TCP)
  let checkTarget = host
  if (isIp && !host.includes(':')) {
    checkTarget = `${host}:80`
  }

  const checkType = isIp ? 'check-tcp' : 'check-http'

  try {
    // Initiate check
    const initiateRes = await fetch(
      `https://check-host.net/${checkType}?host=${encodeURIComponent(checkTarget)}&max_nodes=8`,
      { headers: { Accept: 'application/json' } }
    )
    if (!initiateRes.ok) {
      throw new Error(`check-host initiate failed: ${initiateRes.status}`)
    }
    const initiateData = await initiateRes.json()
    const requestToken: string = initiateData.request_id
    const nodes: Record<string, string[]> = initiateData.nodes || {}

    // Build nodeId → location map
    const nodeMap: Record<
      string,
      { city: string; country: string; countryCode: string; ips: string[] }
    > = {}
    for (const [nodeId, info] of Object.entries(nodes)) {
      const parts = nodeId.split('.')
      const infoArr = info as string[]
      nodeMap[nodeId] = {
        city: infoArr[0] || parts[0] || nodeId,
        country: infoArr[1] || '',
        countryCode: infoArr[2] || '',
        ips: infoArr.slice(3),
      }
    }

    // Poll for results
    let resultData: CheckHostNode = {}
    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
      await sleep(POLL_DELAY_MS)
      const resultRes = await fetch(
        `https://check-host.net/check-result/${requestToken}`,
        { headers: { Accept: 'application/json' } }
      )
      if (resultRes.ok) {
        resultData = await resultRes.json()
        const allDone = Object.entries(resultData).every(([, v]) => v !== null)
        if (allDone) break
      }
    }

    // Format results — TCP and HTTP have different result shapes
    const formattedNodes = Object.entries(nodeMap).map(([nodeId, info]) => {
      const raw = resultData[nodeId]

      if (!raw || !Array.isArray(raw) || raw.length === 0) {
        return { nodeId, ...info, online: null, latencyMs: null, statusText: 'Pending' }
      }

      const firstResult = raw[0] as unknown[]
      if (!Array.isArray(firstResult)) {
        return { nodeId, ...info, online: null, latencyMs: null, statusText: 'No data' }
      }

      if (isIp) {
        // TCP result: [[1, latency_seconds]] or [[0, "error_message"]]
        const statusFlag = firstResult[0]
        const online = statusFlag === 1
        const latencyMs =
          online && typeof firstResult[1] === 'number'
            ? Math.round(firstResult[1] * 1000)
            : null
        const statusText = online
          ? 'TCP Connected'
          : typeof firstResult[1] === 'string'
          ? String(firstResult[1])
          : 'Connection refused'

        return { nodeId, ...info, online, latencyMs, statusText }
      } else {
        // HTTP result: [[status, latency, httpCode, ...]]
        const statusFlag = firstResult[0]
        const latency =
          typeof firstResult[1] === 'number'
            ? Math.round(firstResult[1] * 1000)
            : null
        const httpStatus =
          typeof firstResult[2] === 'number' ? firstResult[2] : null
        const online = statusFlag === 1
        const statusText = online
          ? `HTTP ${httpStatus ?? 200}`
          : typeof firstResult[1] === 'string'
          ? String(firstResult[1])
          : 'Offline'

        return { nodeId, ...info, online, latencyMs: latency, statusText }
      }
    })

    return NextResponse.json({
      host,
      nodes: formattedNodes,
      checkedAt: Date.now(),
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Multi-check failed' },
      { status: 500 }
    )
  }
}
