'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatRupiah, daysLeft, calcDailyTarget } from '@/lib/utils'
import DepositButton from '@/components/DepositButton'
import CustomDepositInput from '@/components/CustomDepositInput'
import DeadlineAlert from '@/components/DeadlineAlert'
import AnnouncementBanner from '@/components/AnnouncementBanner'

type Transaction = { id: string; amount: number; note: string | null; createdAt: Date }
type Goal = {
  id: string
  title: string
  emoji: string | null
  targetAmount: number
  currentAmount: number
  deadline: Date | null
  isCompleted: boolean
  imageUrl: string | null
  transactions: Transaction[]
}

type Props = { goals: Goal[]; userId: string; email: string; name: string | null; announcements: { id: string; title: string; content: string; type: string; createdAt: Date }[] }

export default function UserDashboard({ goals, email, name, announcements }: Props) {
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const activeGoals = goals.filter((g) => !g.isCompleted)
  const completedGoals = goals.filter((g) => g.isCompleted)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Halo, {name || email.split('@')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Yuk lihat progress tabunganmu hari ini!</p>
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-emerald-700">{activeGoals.length}</p>
            <p className="text-xs text-emerald-600 mt-1">Goal Aktif</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-slate-700">{completedGoals.length}</p>
            <p className="text-xs text-slate-500 mt-1">Selesai</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-sm sm:text-lg font-bold text-slate-700 leading-tight">{formatRupiah(totalSaved)}</p>
            <p className="text-xs text-slate-500 mt-1">Terkumpul</p>
          </div>
        </div>
      )}

      {/* Announcement Banner */}
      <AnnouncementBanner announcements={announcements} />

      {/* Deadline Alerts */}
      <DeadlineAlert goals={goals.filter(g => g.deadline !== null) as any} />

      {/* Goal Cards */}
      {goals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Goal Tabunganmu</h2>
            <Link href="/dashboard/savings/new" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              <span>➕</span> Tambah Goal
            </Link>
          </div>
          {goals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))}
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
          <p className="text-xs text-slate-400 mb-3">
            💡 Nabung <span className="font-semibold text-emerald-600">{formatRupiah(dailyTarget)}/hari</span> untuk mencapai target
          </p>
        )}

        {/* Quick Deposit Buttons */}
        <div className="flex gap-2 flex-wrap mt-3">
          {!goal.isCompleted && (
            <>
              <DepositButton goalId={goal.id} amount={10000} label="+10rb" />
              <DepositButton goalId={goal.id} amount={50000} label="+50rb" />
              <DepositButton goalId={goal.id} amount={100000} label="+100rb" />
            </>
          )}
          <Link
            href={`/dashboard/goals/${goal.id}`}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Detail
          </Link>
        </div>
        {!goal.isCompleted && <CustomDepositInput goalId={goal.id} />}
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
