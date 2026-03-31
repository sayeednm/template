'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatRupiah, daysLeft, calcDailyTarget } from '@/lib/utils'

const EMOJIS = ['🎯', '🏠', '✈️', '💻', '🚗', '📱', '👗', '🎓', '💍', '🏖️', '🎮', '📷']

export default function NewGoalForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '', emoji: '🎯' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const target = parseFloat(form.targetAmount) || 0
  const days = form.deadline ? daysLeft(new Date(form.deadline)) : null
  const daily = days && days > 0 && target > 0 ? calcDailyTarget(target, new Date(form.deadline)) : null
  const monthly = daily ? daily * 30 : null

  const handleImageChange = (file: File) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.targetAmount) return
    setLoading(true)

    // 1. Buat goal dulu
    const res = await fetch('/api/savings/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        targetAmount: target,
        deadline: form.deadline || null,
        emoji: form.emoji,
      }),
    })
    const goal = await res.json()

    // 2. Upload foto jika ada
    if (imageFile && goal.id) {
      const formData = new FormData()
      formData.append('file', imageFile)
      await fetch(`/api/savings/goals/${goal.id}/image`, {
        method: 'POST',
        body: formData,
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Foto Barang Incaran */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700 mb-3">📸 Foto Barang Incaran (opsional)</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageChange(f) }}
          onDragOver={(e) => e.preventDefault()}
          className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50 group"
        >
          {imagePreview ? (
            <>
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Ganti Foto</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Klik atau drag foto di sini</p>
              <p className="text-xs">JPG, PNG, WebP · Maks 3MB</p>
            </div>
          )}
        </div>
        {imagePreview && (
          <button
            type="button"
            onClick={() => { setImageFile(null); setImagePreview(null) }}
            className="mt-2 text-xs text-red-400 hover:text-red-500"
          >
            Hapus foto
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageChange(f) }}
        />
      </div>

      {/* Emoji Picker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700 mb-3">Pilih Ikon</label>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setForm({ ...form, emoji: e })}
              className={`text-2xl p-2 rounded-xl transition-all ${form.emoji === e ? 'bg-emerald-100 ring-2 ring-emerald-400 scale-110' : 'hover:bg-slate-100'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Goal</label>
          <input
            type="text"
            placeholder="Contoh: Beli Laptop Gaming"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Jumlah (Rp)</label>
          <input
            type="number"
            placeholder="Contoh: 10000000"
            value={form.targetAmount}
            onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            min="1000"
            required
          />
          {target > 0 && <p className="text-xs text-emerald-600 mt-1 font-medium">{formatRupiah(target)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline (opsional)</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
          />
        </div>
      </div>

      {/* Kalkulator Real-time */}
      {daily && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h3 className="font-semibold text-emerald-800 mb-3">📊 Kalkulator Tabungan</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-600">{formatRupiah(daily)}</p>
              <p className="text-xs text-slate-500 mt-0.5">per hari</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-600">{formatRupiah(monthly!)}</p>
              <p className="text-xs text-slate-500 mt-0.5">per bulan</p>
            </div>
          </div>
          <p className="text-xs text-emerald-700 mt-3 text-center">
            Dalam <span className="font-bold">{days} hari</span> lagi kamu bisa mencapai target ini!
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : `${form.emoji} Buat Goal Sekarang`}
      </button>
    </form>
  )
}
