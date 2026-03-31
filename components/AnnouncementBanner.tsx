'use client'

import { useState, useEffect } from 'react'

type Announcement = { id: string; title: string; content: string; type: string; createdAt: Date }

const TYPE_CONFIG = {
  info: { bg: 'bg-blue-50 border-blue-200', icon: 'ℹ️', title: 'text-blue-800', text: 'text-blue-700', close: 'text-blue-400 hover:text-blue-600' },
  update: { bg: 'bg-emerald-50 border-emerald-200', icon: '🚀', title: 'text-emerald-800', text: 'text-emerald-700', close: 'text-emerald-400 hover:text-emerald-600' },
  warning: { bg: 'bg-orange-50 border-orange-200', icon: '⚠️', title: 'text-orange-800', text: 'text-orange-700', close: 'text-orange-400 hover:text-orange-600' },
}

export default function AnnouncementBanner({ announcements }: { announcements: Announcement[] }) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dismissed_announcements') ?? '[]')
      setDismissed(saved)
    } catch {}
    setMounted(true)
  }, [])

  if (!mounted) return null

  const visible = announcements.filter(a => !dismissed.includes(a.id))
  if (visible.length === 0) return null

  const dismiss = (id: string) => {
    const next = [...dismissed, id]
    setDismissed(next)
    localStorage.setItem('dismissed_announcements', JSON.stringify(next))
  }

  return (
    <div className="space-y-2 mb-5">
      {visible.map((a) => {
        const cfg = TYPE_CONFIG[a.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.info
        return (
          <div key={a.id} className={`flex items-start gap-3 px-4 py-3 rounded-2xl border ${cfg.bg}`}>
            <span className="text-lg flex-shrink-0 mt-0.5">{cfg.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${cfg.title}`}>{a.title}</p>
              <p className={`text-xs mt-0.5 ${cfg.text}`}>{a.content}</p>
            </div>
            <button onClick={() => dismiss(a.id)} className={`flex-shrink-0 p-1 rounded-lg transition-colors ${cfg.close}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
