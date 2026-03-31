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
  const [filterGoal, setFilterGoal] = useState('all')
  const router = useRouter()

  // Daftar goal unik
  const goalOptions = Array.from(new Set(initial.map(t => t.goalTitle)))
    .map(title => ({ title, emoji: initial.find(t => t.goalTitle === title)?.goalEmoji ?? '🎯' }))

  const filtered = filterGoal === 'all' ? transactions : transactions.filter(t => t.goalTitle === filterGoal)

  const handlePrint = () => {
    const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0)
    const goalLabel = filterGoal === 'all' ? 'Semua Goal' : filterGoal
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Riwayat Tabungan GoalSaver</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 32px; color: #1e293b; }
          .header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
          .logo { width: 40px; height: 40px; background: #10b981; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
          .title { font-size: 22px; font-weight: bold; color: #10b981; }
          .subtitle { color: #64748b; font-size: 13px; margin-bottom: 24px; }
          .summary { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px; display: flex; gap: 32px; }
          .summary-item p:first-child { font-size: 12px; color: #64748b; }
          .summary-item p:last-child { font-size: 18px; font-weight: bold; color: #059669; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f8fafc; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 2px solid #e2e8f0; }
          td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
          tr:hover td { background: #f8fafc; }
          .amount { font-weight: bold; color: #059669; }
          .footer { margin-top: 24px; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print { body { padding: 16px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">💰</div>
          <div class="title">GoalSaver</div>
        </div>
        <div class="subtitle">Laporan: ${goalLabel} · Dicetak ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        
        <div class="summary">
          <div class="summary-item">
            <p>Total Transaksi</p>
            <p>${filtered.length}</p>
          </div>
          <div class="summary-item">
            <p>Total Terkumpul</p>
            <p>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount)}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Goal</th>
              <th>Catatan</th>
              <th>Jumlah</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((t, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${t.goalEmoji ?? '🎯'} ${t.goalTitle}</td>
                <td>${t.note ?? '-'}</td>
                <td class="amount">+${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(t.amount)}</td>
                <td>${new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">GoalSaver — Wujudkan impianmu satu tabungan dalam satu waktu</div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(printContent)
      win.document.close()
    }
  }

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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Filter per goal */}
        <select
          value={filterGoal}
          onChange={(e) => setFilterGoal(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="all">Semua Goal ({transactions.length})</option>
          {goalOptions.map((g) => (
            <option key={g.title} value={g.title}>
              {g.emoji} {g.title}
            </option>
          ))}
        </select>
        <button
          onClick={handlePrint}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          🖨️ Cetak / Simpan PDF
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {filtered.map((t, i) => (
        <div
          key={t.id}
          className={`flex items-center justify-between px-5 py-4 group hover:bg-slate-50 transition-colors ${i !== filtered.length - 1 ? 'border-b border-slate-100' : ''}`}
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
    </div>
  )
}
