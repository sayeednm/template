'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { daysLeft } from '@/lib/utils'
import { getSettings } from '@/lib/settings'
import { sendNotification } from '@/lib/notifications'

type Goal = {
  id: string
  title: string
  emoji: string | null
  deadline: Date
  isCompleted: boolean
}

type Props = { goals: Goal[] }

export default function DeadlineAlert({ goals }: Props) {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setEnabled(getSettings().notifDeadline)
  }, [])

  useEffect(() => {
    if (!enabled) return
    // Kirim notifikasi OS untuk deadline hari ini / besok
    const urgent = goals
      .filter((g) => !g.isCompleted && g.deadline)
      .map((g) => ({ ...g, days: daysLeft(new Date(g.deadline)) }))
      .filter((g) => g.days >= 0 && g.days <= 1)

    urgent.forEach((g) => {
      const msg = g.days === 0 ? 'Deadline hari ini!' : 'Deadline besok!'
      sendNotification(`⏰ ${g.emoji ?? ''} ${g.title}`, msg)
    })
  }, [enabled, goals])

  const alerts = goals
    .filter((g) => !g.isCompleted && g.deadline)
    .map((g) => ({ ...g, days: daysLeft(new Date(g.deadline)) }))
    .filter((g) => g.days <= 7)
    .sort((a, b) => a.days - b.days)

  if (!enabled || alerts.length === 0) return null

  return (
    <div className="space-y-2 mb-5">
      {alerts.map((g) => (
        <Link
          key={g.id}
          href={`/dashboard/goals/${g.id}`}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all hover:shadow-sm ${
            g.days <= 0
              ? 'bg-red-50 border-red-200'
              : g.days <= 3
              ? 'bg-orange-50 border-orange-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <span className="text-xl flex-shrink-0">
            {g.days <= 0 ? '🚨' : g.days <= 3 ? '⚠️' : '⏰'}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${
              g.days <= 0 ? 'text-red-700' : g.days <= 3 ? 'text-orange-700' : 'text-yellow-700'
            }`}>
              {g.emoji} {g.title}
            </p>
            <p className={`text-xs ${
              g.days <= 0 ? 'text-red-500' : g.days <= 3 ? 'text-orange-500' : 'text-yellow-600'
            }`}>
              {g.days <= 0 ? 'Deadline sudah terlewat!' : g.days === 1 ? 'Deadline besok!' : `${g.days} hari lagi menuju deadline`}
            </p>
          </div>
          <svg className={`w-4 h-4 flex-shrink-0 ${
            g.days <= 0 ? 'text-red-400' : g.days <= 3 ? 'text-orange-400' : 'text-yellow-500'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  )
}
