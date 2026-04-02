'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerAction } from '@/app/actions/auth-actions'

const FEATURES = [
  { icon: '🤖', title: 'AI Goal Creator', desc: 'Ceritakan impianmu, AI langsung buatkan rencana tabungan.' },
  { icon: '📊', title: 'Progress Real-time', desc: 'Pantau setiap goal dengan grafik dan statistik lengkap.' },
  { icon: '🔔', title: 'Pengingat Deadline', desc: 'Notifikasi otomatis agar kamu tidak melewatkan target.' },
  { icon: '📱', title: 'Bisa Diinstall', desc: 'Install sebagai app di HP atau laptop, tanpa App Store.' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set('role', 'USER')
    const result = await registerAction(null, formData)
    if (result.success) router.push('/login')
    else setError(result.message ?? 'Terjadi kesalahan')
    setLoading(false)
  }

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
            Mulai perjalanan<br />
            <span className="text-emerald-400">menabungmu hari ini.</span>
          </h1>
          <p className="text-slate-300 text-lg mb-12 max-w-md">
            Gratis selamanya. Tidak perlu kartu kredit. Daftar dalam 30 detik.
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

      <div className="flex-1 flex flex-col lg:items-center lg:justify-center bg-white">
        {/* Mobile hero banner */}
        <div className="lg:hidden bg-gradient-to-br from-emerald-500 to-teal-600 px-6 pt-10 pb-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">💰</div>
            <span className="text-xl font-bold">GoalSaver</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Buat akun gratis</h2>
          <p className="text-emerald-100 text-sm">Mulai menabung lebih cerdas sekarang.</p>
        </div>

        <div className="w-full max-w-sm px-6 py-8 lg:py-0 mx-auto">
          <div className="hidden lg:block">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Buat akun gratis</h2>
            <p className="text-slate-500 text-sm mb-8">Mulai menabung lebih cerdas sekarang.</p>
          </div>
          <div className="lg:hidden mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Daftar Sekarang</h2>
            <p className="text-slate-500 text-sm">Gratis, cepat, dan mudah!</p>
          </div>
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
              <input name="password" type="password" placeholder="Minimal 6 karakter" required minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-slate-50 focus:bg-white transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Membuat akun...</> : 'Buat Akun Gratis →'}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4">
            Dengan mendaftar, kamu menyetujui syarat penggunaan GoalSaver.
          </p>
          <p className="text-center text-sm text-slate-500 mt-4">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">Masuk di sini</Link>
          </p>
          <p className="text-center text-xs text-slate-300 mt-6">GoalSaver v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
