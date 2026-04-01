'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSettings } from '@/lib/settings'
import { formatRupiah } from '@/lib/utils'
import { sendNotification } from '@/lib/notifications'
import { useToast } from '@/components/ToastProvider'

type Props = { goalId: string }

export default function CustomDepositInput({ goalId }: Props) {
  const [display, setDisplay] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const router = useRouter()
  const { showToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) { setDisplay(''); return }
    setDisplay(new Intl.NumberFormat('id-ID').format(Number(raw)))
  }

  const handleSave = async () => {
    const amount = parseInt(display.replace(/\./g, '').replace(/,/g, ''))
    if (!amount || amount <= 0) return

    // Konfirmasi jika deposit >= 500rb
    if (amount >= 500000) {
      const ok = confirm(`Konfirmasi deposit ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)}?`)
      if (!ok) return
    }

    setLoading(true)
    const res = await fetch('/api/savings/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goalId, amount, note: note.trim() || null }),
    })
    const data = await res.json()

    if (data.goalCompleted) {
      showToast('🎉 Selamat! Goal kamu tercapai!', 'success')
    } else {
      showToast(`+${formatRupiah(amount)} berhasil ditabung!`, 'success')
    }

    const settings = getSettings()
    if (settings.notifDeposit) {
      sendNotification('GoalSaver 💸', `+${formatRupiah(amount)} berhasil ditabung!`)
    }

    setDisplay('')
    setNote('')
    router.refresh()
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <div className="mt-2 space-y-1.5">
      {toast && (
        <div className="fixed bottom-20 right-5 z-50 bg-emerald-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg">
          💸 {toast}
        </div>
      )}
      {/* Amount input */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">Rp</span>
          <input
            type="text"
            inputMode="numeric"
            value={display}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Lainnya..."
            className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading || !display}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors disabled:opacity-40"
        >
          {loading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          Simpan
        </button>
      </div>

      {/* Note input — hanya muncul kalau ada nominal */}
      {display ? (
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Catatan (opsional)..."
          maxLength={100}
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50 text-slate-600"
        />
      ) : null}
    </div>
  )
}
