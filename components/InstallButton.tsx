'use client'

import { useEffect, useState } from 'react'

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    setInstalling(true)
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
    setInstalling(false)
  }

  if (installed) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="text-sm font-semibold text-emerald-700">Sudah Terinstall</p>
          <p className="text-xs text-emerald-600">GoalSaver sudah ada di perangkatmu</p>
        </div>
      </div>
    )
  }

  if (!deferredPrompt) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-slate-700 mb-1">📱 Install GoalSaver</p>
        <p className="text-xs text-slate-500 mb-3">
          Untuk install, buka menu browser kamu → pilih <strong>"Tambahkan ke layar utama"</strong> atau <strong>"Install App"</strong>
        </p>
        <div className="flex gap-2 text-xs text-slate-400">
          <span>Chrome: ⋮ → Install</span>
          <span>·</span>
          <span>Safari: □↑ → Add to Home</span>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleInstall}
      disabled={installing}
      className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-2xl transition-colors disabled:opacity-50 shadow-sm"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {installing ? 'Menginstall...' : 'Install GoalSaver di Perangkat Ini'}
    </button>
  )
}
