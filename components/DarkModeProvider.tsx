'use client'

import { useEffect } from 'react'

export default function DarkModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply dark mode on mount
    const apply = () => {
      try {
        const s = localStorage.getItem('goalsaver_settings')
        if (s && JSON.parse(s).darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch {}
    }

    apply()

    // Listen for storage changes (saat settings diubah di tab lain atau halaman lain)
    window.addEventListener('storage', apply)
    
    // Custom event untuk update real-time dalam tab yang sama
    window.addEventListener('darkModeChange', apply)

    return () => {
      window.removeEventListener('storage', apply)
      window.removeEventListener('darkModeChange', apply)
    }
  }, [])

  return <>{children}</>
}
