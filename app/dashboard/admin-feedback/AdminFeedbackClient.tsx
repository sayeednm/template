'use client'

import { useState, useEffect } from 'react'

type Feedback = { id: string; subject: string; message: string; status: string; category: string; reply: string | null; createdAt: Date; user: { email: string } }

const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  question: { icon: '❓', label: 'Pertanyaan', color: 'bg-slate-100 text-slate-600' },
  bug: { icon: '🐛', label: 'Bug', color: 'bg-red-100 text-red-700' },
  feature: { icon: '💡', label: 'Saran Fitur', color: 'bg-yellow-100 text-yellow-700' },
  feedback: { icon: '⭐', label: 'Kritik & Saran', color: 'bg-violet-100 text-violet-700' },
}

const STATUS_CONFIG = {
  unread: { label: 'Belum dibaca', color: 'bg-yellow-100 text-yellow-700' },
  read: { label: 'Dibaca', color: 'bg-blue-100 text-blue-700' },
  replied: { label: 'Dibalas', color: 'bg-emerald-100 text-emerald-700' },
}

export default function AdminFeedbackClient({ feedbacks: initial }: { feedbacks: Feedback[] }) {
  const [feedbacks, setFeedbacks] = useState(initial)
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-refresh setiap 10 detik untuk lihat pesan baru dari user
  useEffect(() => {
    const poll = async () => {
      const res = await fetch('/api/feedback/all')
      if (res.ok) {
        const data = await res.json()
        setFeedbacks(data)
      }
    }
    const interval = setInterval(poll, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini?')) return
    await fetch(`/api/feedback/${id}`, { method: 'DELETE' })
    setFeedbacks(prev => prev.filter(f => f.id !== id))
  }

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return
    setLoading(true)

    const res = await fetch(`/api/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: replyText, status: 'replied' }),
    })
    const data = await res.json()

    if (res.ok) {
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...data } : f))
      setReplyingId(null)
      setReplyText('')
    }
    setLoading(false)
  }

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' }),
    })
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'read' } : f))
  }

  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="text-5xl mb-3">💬</div>
        <p className="text-slate-500">Belum ada pesan dari pengguna</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((f) => {
        const cfg = STATUS_CONFIG[f.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.unread
        return (
          <div key={f.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${f.status === 'unread' ? 'border-blue-200' : 'border-slate-200'}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-xs font-medium text-slate-500 truncate max-w-[140px]">{f.user.email}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  {(() => {
                    const cat = CATEGORY_CONFIG[f.category] ?? CATEGORY_CONFIG.question
                    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.icon} {cat.label}</span>
                  })()}
                </div>
                <h3 className="font-semibold text-slate-800">{f.subject}</h3>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {new Date(f.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-4">{f.message}</p>

            {f.reply && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
                <p className="text-xs font-semibold text-emerald-700 mb-1">Balasanmu:</p>
                <p className="text-sm text-emerald-800">{f.reply}</p>
              </div>
            )}

            {replyingId === f.id ? (
              <div className="space-y-2">
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder="Tulis balasan..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => handleReply(f.id)} disabled={loading || !replyText.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-xl transition-colors disabled:opacity-50">
                    {loading ? 'Mengirim...' : 'Kirim Balasan'}
                  </button>
                  <button onClick={() => { setReplyingId(null); setReplyText('') }}
                    className="flex-1 border border-slate-200 text-slate-600 text-sm py-2 rounded-xl hover:bg-slate-50 transition-colors">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {f.status === 'unread' && (
                  <button onClick={() => handleMarkRead(f.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                    Tandai Dibaca
                  </button>
                )}
                <button onClick={() => { setReplyingId(f.id); setReplyText(f.reply ?? '') }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors">
                  {f.reply ? 'Edit Balasan' : '💬 Balas'}
                </button>
                <button onClick={() => handleDelete(f.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors ml-auto">
                  🗑️ Hapus
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
