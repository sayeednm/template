'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'

type Transaction = {
  id: string
  amount: number
  note: string | null
  createdAt: Date
  goalTitle: string
  goalEmoji: string | null
}

export default function HistoryClient({ transactions: initial }: { transactions: Transaction[] }) {
  const [transactions, setTransactions] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi ini? Saldo goal akan berkurang.')) return
    setDeleting(id)

    const res = await fetch(`/api/savings/transactions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
      router.refresh()
    }
    setDeleting(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-slate-500">Belum ada riwayat transaksi</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {transactions.map((t, i) => (
        <div
          key={t.id}
          className={`flex items-center justify-between px-5 py-4 group hover:bg-slate-50 transition-colors ${i !== transactions.length - 1 ? 'border-b border-slate-100' : ''}`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">
              {t.goalEmoji ?? '🎯'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{t.goalTitle}</p>
              {t.note && <p className="text-xs text-slate-400 italic truncate">"{t.note}"</p>}
              <p className="text-xs text-slate-400">
                {new Date(t.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm font-bold text-emerald-600">+{formatRupiah(t.amount)}</span>
            <button
              onClick={() => handleDelete(t.id)}
              disabled={deleting === t.id}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
              title="Hapus transaksi"
            >
              {deleting === t.id ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
