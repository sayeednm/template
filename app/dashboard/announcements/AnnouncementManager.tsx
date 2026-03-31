'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Announcement = { id: string; title: string; content: string; type: string; createdAt: Date }

const TYPE_CONFIG = {
  info: { label: 'Info', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'ℹ️' },
  update: { label: 'Update', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '🚀' },
  warning: { label: 'Penting', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '⚠️' },
}

export default function AnnouncementManager({ announcements: initial }: { announcements: Announcement[] }) {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState(initial)
  const [form, setForm] = useState({ title: '', content: '', type: 'info' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) return
    setLoading(true)

    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (res.ok) {
      setAnnouncements([data, ...announcements])
      setForm({ title: '', content: '', type: 'info' })
      showToast('Pengumuman berhasil dikirim!')
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengumuman ini?')) return
    await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
    setAnnouncements(announcements.filter(a => a.id !== id))
    showToast('Pengumuman dihapus')
  }

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Form buat pengumuman */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Buat Pengumuman Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Judul</label>
            <input
              type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Update Fitur Baru v2.0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Isi Pengumuman</label>
            <textarea
              value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Tulis isi pengumuman di sini..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipe</label>
            <div className="flex gap-2">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <button key={key} type="button" onClick={() => setForm({ ...form, type: key })}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${form.type === key ? cfg.color + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span>{cfg.icon}</span> {cfg.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Mengirim...' : '📢 Kirim ke Semua Pengguna'}
          </button>
        </form>
      </div>

      {/* Daftar pengumuman */}
      <div className="space-y-3">
        <h2 className="font-semibold text-slate-700 text-sm">Riwayat Pengumuman ({announcements.length})</h2>
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
            Belum ada pengumuman
          </div>
        ) : (
          announcements.map((a) => {
            const cfg = TYPE_CONFIG[a.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.info
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{a.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{a.content}</p>
                  </div>
                  <button onClick={() => handleDelete(a.id)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
