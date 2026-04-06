'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminQuickLinks() {
  const [unreadFeedback, setUnreadFeedback] = useState(0)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/feedback/unread-count')
        const data = await res.json()
        setUnreadFeedback(data.count)
      } catch {}
    }
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])

  const links = [
    { href: '/dashboard/users', icon: '👥', label: 'Kelola Pengguna', badge: 0 },
    { href: '/dashboard/announcements', icon: '📢', label: 'Pengumuman', badge: 0 },
    { href: '/dashboard/admin-feedback', icon: '💬', label: 'Pesan Masuk', badge: unreadFeedback },
    { href: '/dashboard/reports', icon: '📈', label: 'Laporan Global', badge: 0 },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile Admin', badge: 0 },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
      {links.map((item) => (
        <Link key={item.href} href={item.href}
          className="relative flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition-all group">
          <span className="text-xl">{item.icon}</span>
          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{item.label}</span>
          {item.badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
