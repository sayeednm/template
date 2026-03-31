'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Props = { goalId: string; currentImage?: string | null }

export default function GoalImageUpload({ goalId, currentImage }: Props) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = async (file: File) => {
    setError('')
    setLoading(true)

    // Preview lokal dulu
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`/api/savings/goals/${goalId}/image`, {
      method: 'POST',
      body: formData,
    })

    let data: any = {}
    try {
      data = await res.json()
    } catch {
      setError('Server error, coba lagi')
      setPreview(currentImage ?? null)
      setLoading(false)
      return
    }

    if (!res.ok) {
      setError(data.error ?? 'Gagal upload')
      setPreview(currentImage ?? null)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50 group"
      >
        {preview ? (
          <>
            <Image src={preview} alt="Goal" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Ganti Foto</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Klik atau drag foto barang incaran</p>
            <p className="text-xs">JPG, PNG, WebP · Maks 3MB</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <svg className="w-6 h-6 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
