'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSettings } from '@/lib/settings'
import { formatRupiah } from '@/lib/utils'
import { sendNotification } from '@/lib/notifications'
import { useToast } from '@/components/ToastProvider'

type Props = { goalId: string; amount: number; label: string }

export default function DepositButton({ goalId, amount, label }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const handleDeposit = async () => {
    if (amount >= 500000) {
      const ok = confirm(`Konfirmasi deposit ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)}?`)
      if (!ok) return
    }
    setLoading(true)
    const res = await fetch('/api/savings/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goalId, amount }),
    })
    const data = await res.json()

    // Cek apakah goal tercapai
    if (data.goalCompleted) {
      showToast('🎉 Selamat! Goal kamu tercapai!', 'success')
    } else {
      showToast(`+${formatRupiah(amount)} berhasil ditabung!`, 'success')
    }

    const settings = getSettings()
    if (settings.notifDeposit) {
      sendNotification('GoalSaver 💸', `+${formatRupiah(amount)} berhasil ditabung!`)
    }

    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDeposit}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium disabled:opacity-50"
    >
      {loading ? '...' : label}
    </button>
  )
}
