'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatRupiah, daysLeft, calcDailyTarget } from '@/lib/utils'

const EMOJIS = ['🎯', '🏠', '✈️', '💻', '🚗', '📱', '👗', '🎓', '💍', '🏖️', '🎮', '📷']

export default function NewGoalForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '', emoji: '🎯' })

  const target = parseFloat(form.targetAmount) || 0
  const days = form.deadline ? daysLeft(new Date(form.deadline)) : null
  const daily = days && days > 0 && target > 0 ? calcDailyTarget(target, new Date(form.deadline)) : null
  const monthly = daily ? daily * 30 : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.targetAmount) return
    setLoading(true)

    await fetch('/api/savings/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        targetAmount: target,
        deadline: form.deadline || null,
        emoji: form.emoji,
      }),
    })

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Emoji Picker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700 mb-3">Pilih Ikon</label>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setForm({ ...form, emoji: e })}
              className={`text-2xl p-2 rounded-xl transition-all ${form.emoji === e ? 'bg-emerald-100 ring-2 ring-emerald-400 scale-110' : 'hover:bg-slate-100'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Goal</label>
          <input
            type="text"
            placeholder="Contoh: Beli Laptop Gaming"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Jumlah (Rp)</label>
          <input
            type="number"
            placeholder="Contoh: 10000000"
            value={form.targetAmount}
            onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            min="1000"
            required
          />
          {target > 0 && (
            <p className="text-xs text-emerald-600 mt-1 font-medium">{formatRupiah(target)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline (opsional)</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
          />
        </div>
      </div>

      {/* Kalkulator Real-time */}
      {daily && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h3 className="font-semibold text-emerald-800 mb-3">📊 Kalkulator Tabungan</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-600">{formatRupiah(daily)}</p>
              <p className="text-xs text-slate-500 mt-0.5">per hari</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-600">{formatRupiah(monthly!)}</p>
              <p className="text-xs text-slate-500 mt-0.5">per bulan</p>
            </div>
          </div>
          <p className="text-xs text-emerald-700 mt-3 text-center">
            Dalam <span className="font-bold">{days} hari</span> lagi kamu bisa mencapai target ini!
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : `${form.emoji} Buat Goal Sekarang`}
      </button>
    </form>
  )
}
