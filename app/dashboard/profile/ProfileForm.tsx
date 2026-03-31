'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Profile = { id: string; fotoProfil: string | null; name: string | null } | null
type Props = { profile: Profile; userEmail: string; userId: string }

type Toast = { message: string; type: 'success' | 'error' }

function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const show = useCallback((message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])
  return { toast, show }
}

export default function ProfileForm({ profile, userEmail }: Props) {
  const router = useRouter()
  const { toast, show } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile state
  const [name, setName] = useState(profile?.name ?? '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [preview, setPreview] = useState(profile?.fotoProfil ?? '')
  const [uploading, setUploading] = useState(false)

  // Password state
  const [pw, setPw] = useState({ current: '', new: '', confirm: '' })
  const [savingPw, setSavingPw] = useState(false)

  const pwValid = pw.new.length >= 6 && pw.new === pw.confirm && pw.current.length > 0

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { show('Ukuran file maks 2MB', 'error'); return }

    // Preview lokal
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/profile/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.success) { show('Foto profil berhasil diperbarui'); router.refresh() }
    else show(data.message ?? 'Gagal upload', 'error')
    setUploading(false)
  }

  const handleDeletePhoto = async () => {
    if (!confirm('Hapus foto profil?')) return
    const res = await fetch('/api/profile/update', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fotoProfil: null }),
    })
    const data = await res.json()
    if (data.success) { setPreview(''); show('Foto profil dihapus'); router.refresh() }
    else show(data.message ?? 'Gagal', 'error')
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    const res = await fetch('/api/profile/update', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    if (data.success) { show('Profil berhasil disimpan'); router.refresh() }
    else show(data.message ?? 'Gagal', 'error')
    setSavingProfile(false)
  }

  const handleChangePassword = async () => {
    if (!pwValid) return
    setSavingPw(true)
    const res = await fetch('/api/profile/change-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.new }),
    })
    const data = await res.json()
    if (data.success) { show('Password berhasil diperbarui'); setPw({ current: '', new: '', confirm: '' }) }
    else show(data.message ?? 'Gagal', 'error')
    setSavingPw(false)
  }

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? '✓ ' : '✕ '}{toast.message}
        </div>
      )}

      {/* Foto Profil */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-5">Foto Profil</h2>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 cursor-pointer group flex-shrink-0"
          >
            {preview ? (
              <Image src={preview} alt="Profile" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{userEmail.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <span className="text-white text-xs font-medium">Ganti</span>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                <svg className="w-5 h-5 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <p className="font-medium text-slate-700">{name || userEmail.split('@')[0]}</p>
            <p className="text-sm text-slate-400 mb-3">{userEmail}</p>
            <div className="flex gap-2 justify-center sm:justify-start">
              <button onClick={() => fileInputRef.current?.click()} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors">
                Upload Foto
              </button>
              {preview && (
                <button onClick={handleDeletePhoto} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Data Diri */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-5">Informasi Profil</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
            <input value={userEmail} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Nama Lengkap</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleSaveProfile} disabled={savingProfile}
          className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Ganti Password */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-1">Keamanan Akun</h2>
        <p className="text-xs text-slate-400 mb-5">Ganti password secara berkala untuk keamanan akunmu</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Password Saat Ini</label>
            <input
              type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Password Baru</label>
            <input
              type="password" value={pw.new} onChange={(e) => setPw({ ...pw, new: e.target.value })}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Konfirmasi Password Baru</label>
            <input
              type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              placeholder="Ulangi password baru"
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm ${
                pw.confirm && pw.new !== pw.confirm ? 'border-red-300 bg-red-50' : 'border-slate-200'
              }`}
            />
            {pw.confirm && pw.new !== pw.confirm && (
              <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
            )}
          </div>
        </div>
        <button
          onClick={handleChangePassword} disabled={!pwValid || savingPw}
          className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {savingPw ? 'Memperbarui...' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}
