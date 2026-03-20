'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminStatusRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin?tab=status')
  }, [router])

  return null
}
