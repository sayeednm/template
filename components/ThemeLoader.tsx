'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ThemeLoader() {
  const pathname = usePathname()

  // Jalankan setiap kali pathname berubah (navigasi antar halaman)
  useEffect(() => {
    const stored = localStorage.getItem('goalsaver_settings')
    if (stored) {
      try {
        const settings = JSON.parse(stored)
        if (settings.darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch {}
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [pathname])

  return null
}
