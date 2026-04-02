'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import { useToast } from '@/components/ToastProvider'

type Goal = {
  id: string
  title: string
  emoji: string | null
  imageUrl: string | null
  targetAmount: number
  currentAmount: number
  isArchived: boolean
  updatedAt: Date
  transactions: { createdAt: Date }[]
  _count: { transactions: number }
}

export default function AchievementsClient({ goals: initial }: { goals: Goal[] }) {
  const [goals, setGoals] = useState(initial)
  const [filter, setFilter] = useState<'all' | 'archived' | 'active'>('all')
  const router = useRouter()
  const { showToast } = useToast()

  const filtered = goals.filter(g => {
    if (filter === 'archived') return g.isArchived
    if (filter === 'active') return !g.isArchived
    return true
  })

  const totalAchieved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const archivedCount = goals.filter(g => g.isArchived).length

  const handleUnarchive = async (id: string) => {
    await fetch(`/api/savings/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isArchived: false }),
    })
    setGoals(prev => prev.map(g => g.id === id ? { ...g, isArchived: false } : g))
    showToast('Goal dikembalikan ke dashboard!', 'success')
    router.refresh()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-2xl font-bold text-slate-800">Capaianku</h1>
        <p className="text-slate-500 text-sm mt-1">Goal yang sudah berhasil kamu wujudkan!</p>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Belum ada capaian</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Selesaikan goal pertamamu!</p>
          <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Lihat Goal Aktif
          </Link>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-white text-center col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold">{goals.length}</p>
              <p className="text-xs text-yellow-100 mt-1">Goal Tercapai 🏆</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-lg font-bold text-emerald-600">{formatRupiah(totalAchieved)}</p>
              <p className="text-xs text-slate-500 mt-1">Total Ditabung</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-violet-600">{archivedCount}</p>
              <p className="text-xs text-slate-500 mt-1">Diarsipkan</p>
            </div>
          </div>

          {/* Filter */}
          {archivedCount > 0 && (
            <div className="flex gap-2 mb-5">
              {[
                { value: 'all', label: 'Semua' },
                { value: 'active', label: 'Di Dashboard' },
                { value: 'archived', label: 'Diarsipkan' },
              ].map((f) => (
                <button key={f.value} onClick={() => setFilter(f.value as any)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-colors ${filter === f.value ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Trophy Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((goal, index) => {
              const firstDeposit = goal.transactions[0]?.createdAt
              const daysToComplete = firstDeposit
                ? Math.ceil((new Date(goal.updatedAt).getTime() - new Date(firstDeposit).getTime()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <div key={goal.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden relative ${goal.isArchived ? 'border-slate-200 opacity-75' : 'border-emerald-200'}`}>
                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      #{index + 1}
                    </div>
                  </div>

                  {goal.imageUrl ? (
                    <div className="relative h-36 overflow-hidden">
                      <Image src={goal.imageUrl} alt={goal.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-2xl">{goal.emoji ?? '🎯'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-20 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-4xl">{goal.emoji ?? '🎯'}</span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800">{goal.title}</h3>
                        {goal.isArchived && (
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">📦 Diarsipkan</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center mb-3">
                      <div className="bg-slate-50 rounded-xl p-2">
                        <p className="text-xs text-slate-500">Ditabung</p>
                        <p className="text-sm font-bold text-emerald-600">{formatRupiah(goal.currentAmount)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2">
                        <p className="text-xs text-slate-500">Deposit</p>
                        <p className="text-sm font-bold text-slate-700">{goal._count.transactions}x</p>
                      </div>
                    </div>

                    {daysToComplete && (
                      <p className="text-xs text-slate-400 text-center mb-2">
                        ⏱ Selesai dalam <span className="font-semibold text-slate-600">{daysToComplete} hari</span>
                      </p>
                    )}

                    {/* Tombol kembalikan jika diarsipkan */}
                    {goal.isArchived && (
                      <button onClick={() => handleUnarchive(goal.id)}
                        className="w-full text-xs py-2 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors font-medium">
                        ↩ Kembalikan ke Dashboard
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
