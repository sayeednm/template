'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginAction } from '@/app/actions/auth-actions'

const FEATURES = [
  { icon: '🤖', title: 'AI Goal Creator', desc: 'Ceritakan impianmu, AI langsung buatkan rencana tabungan.' },
  { icon: '📊', title: 'Progress Real-time', desc: 'Pantau setiap goal dengan grafik dan statistik lengkap.' },
  { icon: '🔔', title: 'Pengingat Deadline', desc: 'Notifikasi otomatis agar kamu tidak melewatkan target.' },
]

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => { if (data.authenticated) router.push('/dashboard'); else setChecking(false) })
      .catch(() => setChecking(false))
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(null, formData)
    if (result.success) { router.push('/dashboard'); router.refresh() }
    else setError(result.message ?? 'Login gagal')
    setLoading(false)
  }

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex-col justify-between p-14 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl">💰</div>
          <span className="text-xl font-bold tracking-tight">GoalSaver</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight mb-5">
            Tabung lebih cerdas<br />
            <span className="text-emerald-400">dengan bantuan AI.</span>
          </h1>
          <p className="text-slate-300 text-lg mb-12 max-w-md">
            Ceritakan impianmu, GoalSaver AI akan menghitung dan membuatkan rencana tabungan secara otomatis.
          </p>
          <div className="space-y-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{f.icon}</div>
                <div>
                  <p className="font-semibold text-white">{f.title}</p>
                  <p className="text-sm text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-xs text-slate-500">© 2025 GoalSaver. Gratis selamanya.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-base">💰</div>
            <span className="text-lg font-bold text-slate-800">GoalSaver</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Masuk ke akun</h2>
          <p className="text-slate-500 text-sm mb-8">Selamat datang kembali 👋</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input name="email" type="email" placeholder="kamu@email.com" required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-slate-50 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input name="password" type="password" placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-slate-50 focus:bg-white transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Masuk...</> : 'Masuk'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">Daftar gratis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
