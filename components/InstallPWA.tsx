'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Sudah diinstall
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // User sudah dismiss sebelumnya — jangan tampilkan lagi
    if (localStorage.getItem('install_dismissed') === 'true') return

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
    if (outcome === 'accepted') {
      setShow(false)
      localStorage.setItem('install_dismissed', 'true')
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('install_dismissed', 'true')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 animate-in slide-in-from-bottom duration-300 max-w-xs">
      <div className="bg-white border border-emerald-200 rounded-2xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
            💰
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm">Install GoalSaver</p>
            <p className="text-xs text-slate-500 mt-0.5">Akses lebih cepat dari HP/laptop</p>
          </div>
          <button onClick={handleDismiss} className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={handleInstall}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
            Install Sekarang
          </button>
          <button onClick={handleDismiss}
            className="flex-1 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-medium py-2 rounded-xl transition-colors">
            Nanti
          </button>
        </div>
        {/* Hint ke halaman Tentang App */}
        <p className="text-xs text-slate-400 text-center mt-2">
          Bisa install kapan saja di{' '}
          <Link href="/dashboard/about" onClick={handleDismiss} className="text-emerald-600 font-medium hover:underline">
            Tentang App
          </Link>
        </p>
      </div>
    </div>
  )
}
