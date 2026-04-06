'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminFeedbackBadge() {
  const [unread, setUnread] = useState(0)
  const pathname = usePathname()

  const checkUnread = async () => {
    try {
      const res = await fetch('/api/feedback/unread-count')
      if (!res.ok) return
      const data = await res.json()
      setUnread(data.count)
    } catch {}
  }

  useEffect(() => {
    checkUnread()
    const interval = setInterval(checkUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (pathname === '/dashboard/admin-feedback') {
      setTimeout(checkUnread, 500)
    }
  }, [pathname])

  const isActive = pathname === '/dashboard/admin-feedback'

  return (
    <Link href="/dashboard/admin-feedback"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
        isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className="text-base group-hover:scale-105 transition-transform">💬</span>
      <span>Pesan Masuk</span>
      {unread > 0 ? (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
          {unread > 9 ? '9+' : unread}
        </span>
      ) : isActive ? (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
      ) : null}
    </Link>
  )
}
