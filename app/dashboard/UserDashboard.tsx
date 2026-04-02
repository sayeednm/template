'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatRupiah, daysLeft, calcDailyTarget, getMotivation } from '@/lib/utils'
import DepositButton from '@/components/DepositButton'
import CustomDepositInput from '@/components/CustomDepositInput'
import DeadlineAlert from '@/components/DeadlineAlert'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import { useToast } from '@/components/ToastProvider'

type Transaction = { id: string; amount: number; note: string | null; createdAt: Date }
type Goal = {
  id: string
  title: string
  emoji: string | null
  targetAmount: number
  currentAmount: number
  deadline: Date | null
  isCompleted: boolean
  isPaused: boolean
  isArchived: boolean
  imageUrl: string | null
  createdAt: Date
  transactions: Transaction[]
}

type Props = { goals: Goal[]; userId: string; email: string; name: string | null; announcements: { id: string; title: string; content: string; type: string; createdAt: Date }[] }

export default function UserDashboard({ goals, email, name, announcements }: Props) {
  const [sortBy, setSortBy] = useState<'newest' | 'progress' | 'deadline'>('newest')
  const [showCompleted, setShowCompleted] = useState(false)

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const activeGoals = goals.filter((g) => !g.isCompleted)
  const completedGoals = goals.filter((g) => g.isCompleted)

  const filteredGoals = goals
    .filter((g) => !g.isArchived) // sembunyikan yang sudah diarsipkan
    .filter((g) => showCompleted || !g.isCompleted)
    .sort((a, b) => {
      if (sortBy === 'progress') {
        return (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount)
      }
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Halo, {name || email.split('@')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Yuk lihat progress tabunganmu hari ini!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
        <div className="bg-emerald-500 rounded-2xl p-3 sm:p-4 text-white shadow-sm">
          <p className="text-xs text-emerald-100 mb-1">Goal Aktif</p>
          <p className="text-2xl sm:text-3xl font-bold">{activeGoals.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">Tercapai</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{completedGoals.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">Terkumpul</p>
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight truncate">{formatRupiah(totalSaved)}</p>
        </div>
      </div>

      {/* Quick Actions — grid profesional */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <Link href="/dashboard/savings/new" className="flex flex-col items-center gap-1.5 bg-white border border-slate-200 rounded-2xl py-3 px-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
          <div className="w-9 h-9 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xs font-medium text-slate-600 group-hover:text-emerald-700 text-center leading-tight">Tambah Goal</span>
        </Link>

        <Link href="/dashboard/achievements" className="flex flex-col items-center gap-1.5 bg-white border border-slate-200 rounded-2xl py-3 px-2 hover:bg-amber-50 hover:border-amber-200 transition-all group">
          <div className="w-9 h-9 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-slate-600 group-hover:text-amber-700 text-center leading-tight">Capaian</span>
        </Link>

        <Link href="/dashboard/savings/history" className="flex flex-col items-center gap-1.5 bg-white border border-slate-200 rounded-2xl py-3 px-2 hover:bg-blue-50 hover:border-blue-200 transition-all group">
          <div className="w-9 h-9 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700 text-center leading-tight">Riwayat</span>
        </Link>

        <Link href="/dashboard/feedback" className="flex flex-col items-center gap-1.5 bg-white border border-slate-200 rounded-2xl py-3 px-2 hover:bg-violet-50 hover:border-violet-200 transition-all group">
          <div className="w-9 h-9 bg-violet-100 group-hover:bg-violet-200 rounded-xl flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-slate-600 group-hover:text-violet-700 text-center leading-tight">Bantuan</span>
        </Link>
      </div>

      {/* Announcement Banner */}
      <AnnouncementBanner announcements={announcements} />

      {/* Deadline Alerts */}
      <DeadlineAlert goals={goals.filter(g => g.deadline !== null) as any} />

      {/* Goal Cards */}
      {goals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-slate-700">Goal Tabunganmu</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {completedGoals.length > 0 && (
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${showCompleted ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
                >
                  {showCompleted ? `Sembunyikan yang selesai (${completedGoals.length})` : `Tampilkan semua`}
                </button>
              )}
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="newest">Terbaru</option>
                <option value="progress">Progress</option>
                <option value="deadline">Deadline</option>
              </select>
              <Link href="/dashboard/savings/new" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                <span>➕</span> Tambah
              </Link>
            </div>
          </div>
          {filteredGoals.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">Tidak ada goal yang ditampilkan</div>
          ) : (
            filteredGoals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

const CARD_ACCENTS = [
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-violet-400 to-purple-500',
  'from-orange-400 to-amber-500',
  'from-pink-400 to-rose-500',
  'from-cyan-400 to-sky-500',
]

function GoalCard({ goal, index }: { goal: Goal; index: number }) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = goal.targetAmount - goal.currentAmount
  const days = goal.deadline ? daysLeft(goal.deadline) : null
  const dailyTarget = goal.deadline && remaining > 0 ? calcDailyTarget(remaining, goal.deadline) : null

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 duration-200 ${goal.isCompleted ? 'border-emerald-200' : 'border-slate-200'}`}>
      {/* Accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${goal.isCompleted ? 'from-emerald-400 to-teal-400' : accent}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Thumbnail foto atau emoji */}
            {goal.imageUrl ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                <Image src={goal.imageUrl} alt={goal.title} fill className="object-cover" />
              </div>
            ) : (
              <span className="text-3xl">{goal.emoji ?? '🎯'}</span>
            )}
            <div>
              <h3 className="font-semibold text-slate-800">{goal.title}</h3>
              {goal.isCompleted ? (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✅ Tercapai!</span>
              ) : days !== null ? (
                <span className="text-xs text-slate-500">{days > 0 ? `${days} hari lagi` : 'Deadline terlewat'}</span>
              ) : null}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-emerald-600">{formatRupiah(goal.currentAmount)}</p>
            <p className="text-xs text-slate-400">dari {formatRupiah(goal.targetAmount)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{progress.toFixed(2)}% tercapai</span>
            <span>Sisa {formatRupiah(remaining)}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${goal.isCompleted ? 'from-emerald-400 to-teal-400' : accent}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Daily target hint */}
        {dailyTarget && !goal.isCompleted && (
          <p className="text-xs text-slate-400 mb-2">
            💡 Nabung <span className="font-semibold text-emerald-600">{formatRupiah(dailyTarget)}/hari</span> untuk mencapai target
          </p>
        )}

        {/* Motivasi progress */}
        {!goal.isPaused && (() => {
          const mot = getMotivation(progress)
          return (
            <p className={`text-xs font-medium mb-3 ${mot.color}`}>
              {mot.emoji} {mot.message}
            </p>
          )
        })()}

        {/* Quick Deposit Buttons */}
        <div className="flex gap-2 flex-wrap mt-3">
          {!goal.isCompleted && !goal.isPaused && (
            <>
              <DepositButton goalId={goal.id} amount={10000} label="+10rb" />
              <DepositButton goalId={goal.id} amount={50000} label="+50rb" />
              <DepositButton goalId={goal.id} amount={100000} label="+100rb" />
            </>
          )}
          {goal.isPaused && (
            <span className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 font-medium">
              ⏸ Dijeda
            </span>
          )}
          <Link
            href={`/dashboard/goals/${goal.id}`}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Detail
          </Link>
          {goal.isCompleted && <ArchiveButton goalId={goal.id} />}
        </div>
        {!goal.isCompleted && !goal.isPaused && <CustomDepositInput goalId={goal.id} />}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center text-5xl shadow-inner">
          💰
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
          +
        </div>
      </div>
      <h2 className="text-xl font-bold text-slate-700 mb-2">Belum ada goal tabungan</h2>
      <p className="text-slate-400 mb-8 max-w-xs text-sm leading-relaxed">
        Mulai perjalanan menabungmu! Buat target pertama atau ceritakan ke AI apa yang ingin kamu beli.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/savings/new"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
        >
          ➕ Buat Goal Manual
        </Link>
        <div className="text-sm text-slate-400 flex items-center justify-center gap-2">
          <span>atau</span>
          <span className="text-emerald-600 font-medium">tanya AI di pojok kanan bawah 🤖</span>
        </div>
      </div>
    </div>
  )
}

function ArchiveButton({ goalId }: { goalId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleArchive = async () => {
    if (!confirm('Arsipkan goal ini? Goal akan disembunyikan dari dashboard tapi tetap bisa dilihat di halaman Capaian.')) return
    setLoading(true)
    await fetch(`/api/savings/goals/${goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isArchived: true }),
    })
    showToast('Goal berhasil diarsipkan!', 'success')
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleArchive}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
    >
      {loading ? '...' : '📦 Arsipkan'}
    </button>
  )
}
