'use client'

import { useEffect, useState } from 'react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Sudah diinstall — jangan tampilkan
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white border border-emerald-200 rounded-2xl shadow-lg p-4 flex items-center gap-3 max-w-xs">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
          💰
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm">Install GoalSaver</p>
          <p className="text-xs text-slate-500">Akses lebih cepat dari HP/laptop</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <button onClick={handleInstall}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            Install
          </button>
          <button onClick={() => setShow(false)}
            className="text-slate-400 hover:text-slate-600 text-xs text-center transition-colors">
            Nanti
          </button>
        </div>
      </div>
    </div>
  )
}
