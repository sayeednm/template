'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FeedbackBadge() {
  const [hasNewReply, setHasNewReply] = useState(false)
  const pathname = usePathname()

  const checkNewReplies = async () => {
    try {
      const res = await fetch('/api/feedback')
      if (!res.ok) return
      const feedbacks = await res.json()

      // Ambil timestamp terakhir user buka halaman feedback
      const lastSeen = parseInt(localStorage.getItem('feedback_last_seen') ?? '0')

      // Cek apakah ada balasan baru setelah lastSeen
      const hasNew = feedbacks.some((f: { status: string; updatedAt: string }) =>
        f.status === 'replied' && new Date(f.updatedAt).getTime() > lastSeen
      )
      setHasNewReply(hasNew)
    } catch {}
  }

  useEffect(() => {
    checkNewReplies()
    const interval = setInterval(checkNewReplies, 30000)
    return () => clearInterval(interval)
  }, [])

  // Reset badge saat buka halaman feedback
  useEffect(() => {
    if (pathname === '/dashboard/feedback') {
      localStorage.setItem('feedback_last_seen', Date.now().toString())
      setHasNewReply(false)
    }
  }, [pathname])

  const isActive = pathname === '/dashboard/feedback'

  return (
    <Link href="/dashboard/feedback"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
        isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className="text-base group-hover:scale-105 transition-transform">💬</span>
      <span>Hubungi Admin</span>
      {hasNewReply ? (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
          !
        </span>
      ) : isActive ? (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
      ) : null}
    </Link>
  )
}
