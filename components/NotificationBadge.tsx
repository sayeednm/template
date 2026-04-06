'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NotificationBadge() {
  const [unread, setUnread] = useState(0)
  const pathname = usePathname()

  const checkUnread = async () => {
    try {
      const res = await fetch('/api/announcements')
      if (!res.ok) return
      const announcements = await res.json()
      const readIds: string[] = JSON.parse(localStorage.getItem('read_announcements') ?? '[]')
      const count = announcements.filter((a: { id: string }) => !readIds.includes(a.id)).length
      setUnread(count)
    } catch {}
  }

  useEffect(() => {
    checkUnread()
    // Polling setiap 30 detik
    const interval = setInterval(checkUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  // Reset badge saat buka halaman notifikasi
  useEffect(() => {
    if (pathname === '/dashboard/notifications') {
      setTimeout(checkUnread, 500)
    }
  }, [pathname])

  return (
    <Link href="/dashboard/notifications"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
        ${pathname === '/dashboard/notifications'
          ? 'bg-emerald-50 text-emerald-700 shadow-sm'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      <span className="text-base transition-transform duration-150 group-hover:scale-105">🔔</span>
      <span>Pemberitahuan</span>
      {unread > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
      {pathname === '/dashboard/notifications' && unread === 0 && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
      )}
    </Link>
  )
}
