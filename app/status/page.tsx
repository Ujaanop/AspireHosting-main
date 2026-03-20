import type { Metadata } from 'next'
import StatusDashboard from '@/app/components/status/StatusDashboard'

export const metadata: Metadata = {
  title: 'Status | AspireHosting',
  description: 'Real-time status and health monitoring for AspireHosting services.',
}

export default function StatusPage() {
  return <StatusDashboard />
}
