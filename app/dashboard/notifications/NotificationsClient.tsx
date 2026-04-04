'use client'

import { useEffect, useState } from 'react'

type Announcement = { id: string; title: string; content: string; type: string; createdAt: Date }

const TYPE_CONFIG = {
  info: { icon: 'ℹ️', label: 'Info', bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  update: { icon: '🚀', label: 'Update', bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  warning: { icon: '⚠️', label: 'Penting', bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
}

export default function NotificationsClient({ announcements }: { announcements: Announcement[] }) {
  const [read, setRead] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('read_announcements') ?? '[]')
      setRead(saved)
    } catch {}
  }, [])

  const markRead = (id: string) => {
    if (read.includes(id)) return
    const next = [...read, id]
    setRead(next)
    localStorage.setItem('read_announcements', JSON.stringify(next))
  }

  const unreadCount = announcements.filter(a => !read.includes(a.id)).length

  if (announcements.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔔</div>
        <p className="text-slate-500 text-sm">Belum ada pemberitahuan</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">{unreadCount} belum dibaca</span>
          <button
            onClick={() => {
              const allIds = announcements.map(a => a.id)
              setRead(allIds)
              localStorage.setItem('read_announcements', JSON.stringify(allIds))
            }}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Tandai semua dibaca
          </button>
        </div>
      )}

      {announcements.map((a) => {
        const cfg = TYPE_CONFIG[a.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.info
        const isRead = read.includes(a.id)

        return (
          <div
            key={a.id}
            onClick={() => markRead(a.id)}
            className={`relative rounded-2xl border p-5 cursor-pointer transition-all ${isRead ? 'bg-white border-slate-200' : cfg.bg}`}
          >
            {/* Unread dot */}
            {!isRead && (
              <span className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            )}

            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(a.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <h3 className={`font-semibold mb-1 ${isRead ? 'text-slate-600' : 'text-slate-800'}`}>{a.title}</h3>
                <p className={`text-sm leading-relaxed ${isRead ? 'text-slate-400' : 'text-slate-600'}`}>{a.content}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
