'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatRupiah, daysLeft } from '@/lib/utils'
import SavingsChart from '@/components/SavingsChart'
import GoalImageUpload from '@/components/GoalImageUpload'

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
  pausedAt: Date | null
  imageUrl: string | null
  transactions: Transaction[]
}

export default function GoalDetailClient({ goal }: { goal: Goal }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: goal.title,
    targetAmount: goal.targetAmount.toString(),
    deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
    emoji: goal.emoji ?? '🎯',
  })

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = goal.targetAmount - goal.currentAmount
  const days = goal.deadline ? daysLeft(new Date(goal.deadline)) : null

  const handleSaveEdit = async () => {
    setSaving(true)
    await fetch(`/api/savings/goals/${goal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        targetAmount: parseFloat(form.targetAmount),
        deadline: form.deadline || null,
        emoji: form.emoji,
      }),
    })
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  const handleTogglePause = async () => {
    if (!goal.isPaused) {
      const ok = confirm('⏸ Jeda Goal?\n\nSaat goal dijeda:\n• Tombol deposit disembunyikan\n• Deadline otomatis mundur sesuai lama jeda\n\nKamu bisa melanjutkan kapan saja.')
      if (!ok) return
    } else {
      const pausedDays = goal.pausedAt
        ? Math.ceil((new Date().getTime() - new Date(goal.pausedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0
      const ok = confirm(`▶️ Lanjutkan Goal?\n\nGoal dijeda selama ${pausedDays} hari.${goal.deadline ? `\nDeadline dimundurkan ${pausedDays} hari.` : ''}\n\nLanjutkan menabung?`)
      if (!ok) return
    }
    setSaving(true)
    await fetch(`/api/savings/goals/${goal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaused: !goal.isPaused }),
    })
    setSaving(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Yakin mau hapus goal ini? Semua riwayat akan ikut terhapus.')) return
    setDeleting(true)
    await fetch(`/api/savings/goals/${goal.id}`, { method: 'DELETE' })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </Link>

      {/* Goal Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        {!editing ? (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{goal.emoji ?? '🎯'}</span>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{goal.title}</h1>
                  {goal.isCompleted ? (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✅ Tercapai!</span>
                  ) : goal.isPaused ? (
                    <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">⏸ Dijeda</span>
                  ) : days !== null ? (
                    <span className="text-xs text-slate-500">{days > 0 ? `${days} hari lagi` : 'Deadline terlewat'}</span>
                  ) : (
                    <span className="text-xs text-slate-400">Tanpa deadline</span>
                  )}
                </div>
              </div>
              <button onClick={() => setEditing(true)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-emerald-600">{formatRupiah(goal.currentAmount)}</span>
                <span className="text-slate-400">dari {formatRupiah(goal.targetAmount)}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{progress.toFixed(2)}% tercapai</span>
                <span>Sisa {formatRupiah(remaining)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <h2 className="font-semibold text-slate-700 mb-3">Edit Goal</h2>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nama Goal</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Target Jumlah (Rp)</label>
              <input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" min="1000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleSaveEdit} disabled={saving}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 rounded-xl transition-colors disabled:opacity-50">
                {saving ? 'Menyimpan...' : '✓ Simpan'}
              </button>
              <button onClick={() => setEditing(false)}
                className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2 rounded-xl hover:bg-slate-50 transition-colors">
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Foto */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <h2 className="font-semibold text-slate-700 mb-3">📸 Foto Barang Incaran</h2>
        <GoalImageUpload goalId={goal.id} currentImage={goal.imageUrl} />
      </div>

      {/* Chart */}
      {goal.transactions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
          <h2 className="font-semibold text-slate-700 mb-1">Grafik Tabungan</h2>
          <p className="text-xs text-slate-400 mb-4">Progress terkumpul</p>
          <SavingsChart transactions={goal.transactions} />
        </div>
      )}

      {/* Riwayat */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-700">Riwayat Menabung</h2>
          <p className="text-xs text-slate-400 mt-0.5">{goal.transactions.length} transaksi</p>
        </div>
        {goal.transactions.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">Belum ada transaksi</div>
        ) : (
          <div>
            {goal.transactions.map((t, i) => (
              <TransactionRow key={t.id} t={t} isLast={i === goal.transactions.length - 1} goalId={goal.id} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!goal.isCompleted && (
          <button onClick={handleTogglePause} disabled={saving}
            className={`flex-1 border text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
              goal.isPaused ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-orange-200 text-orange-500 hover:bg-orange-50'
            }`}>
            {saving
              ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Memproses...</>
              : goal.isPaused ? '▶️ Lanjutkan Goal' : '⏸ Jeda Goal'}
          </button>
        )}
        <button onClick={handleDelete} disabled={deleting}
          className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
          {deleting ? 'Menghapus...' : '🗑️ Hapus Goal'}
        </button>
      </div>
    </div>
  )
}

function TransactionRow({ t, isLast, goalId, onDelete }: { t: Transaction; isLast: boolean; goalId: string; onDelete?: (amount: number, newAmount: number) => void }) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Hapus transaksi ini? Saldo goal akan berkurang.')) return
    setDeleting(true)
    const res = await fetch(`/api/savings/transactions/${t.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok && data.newAmount !== undefined) {
      onDelete?.(t.amount, data.newAmount)
    }
    router.refresh()
  }

  return (
    <div className={`flex items-center justify-between px-5 py-3.5 group hover:bg-slate-50 transition-colors ${!isLast ? 'border-b border-slate-50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-sm">💸</div>
        <div>
          <p className="text-xs font-medium text-slate-700">{t.note ?? 'Deposit'}</p>
          <p className="text-xs text-slate-400">
            {new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-emerald-600">+{formatRupiah(t.amount)}</span>
        <button onClick={handleDelete} disabled={deleting}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
