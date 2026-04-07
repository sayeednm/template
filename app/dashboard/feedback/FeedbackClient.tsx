'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Feedback = { id: string; subject: string; message: string; status: string; reply: string | null; createdAt: Date }

const STATUS_CONFIG = {
  unread: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  read: { label: 'Dibaca', color: 'bg-blue-100 text-blue-700' },
  replied: { label: 'Dibalas', color: 'bg-emerald-100 text-emerald-700' },
}

export default function FeedbackClient({ feedbacks: initial }: { feedbacks: Feedback[] }) {
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState(initial)
  const [form, setForm] = useState({ subject: '', message: '', category: 'question' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject || !form.message) return
    setLoading(true)

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (res.ok) {
      setFeedbacks([data, ...feedbacks])
      setForm({ subject: '', message: '', category: 'question' })
      setSent(true)
      setTimeout(() => setSent(false), 3000)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      {/* Form kirim */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Kirim Pesan</h2>
        {sent && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 text-sm text-emerald-700">
            ✅ Pesan berhasil dikirim! Admin akan segera membalas.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 force-light">
          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Kategori</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'question', icon: '❓', label: 'Pertanyaan' },
                { value: 'bug', icon: '🐛', label: 'Laporkan Bug' },
                { value: 'feature', icon: '💡', label: 'Saran Fitur' },
                { value: 'feedback', icon: '⭐', label: 'Kritik & Saran' },
              ].map((cat) => (
                <button key={cat.value} type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form.category === cat.value
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}>
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Subjek</label>
            <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="Ringkasan singkat pesanmu"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white text-slate-800"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Pesan</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Jelaskan lebih detail..."
              rows={4} required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm resize-none bg-white text-slate-800" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Mengirim...' : '📨 Kirim Pesan'}
          </button>
        </form>
      </div>

      {/* Riwayat pesan */}
      {feedbacks.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-700 text-sm">Riwayat Pesan ({feedbacks.length})</h2>
          {feedbacks.map((f) => {
            const cfg = STATUS_CONFIG[f.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.unread
            return (
              <div key={f.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-slate-800 text-sm">{f.subject}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{f.message}</p>
                <p className="text-xs text-slate-400">
                  {new Date(f.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                {f.reply && (
                  <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-emerald-700 mb-1">💬 Balasan Admin:</p>
                    <p className="text-sm text-emerald-800">{f.reply}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
