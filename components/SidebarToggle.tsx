'use client'

import { useEffect, useState } from 'react'

export default function SidebarToggle() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed')
    const isCollapsed = saved === 'true'
    setCollapsed(isCollapsed)
    document.documentElement.setAttribute('data-sidebar', isCollapsed ? 'collapsed' : 'open')
  }, [])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar_collapsed', String(next))
    document.documentElement.setAttribute('data-sidebar', next ? 'collapsed' : 'open')
  }

  return (
    <button
      onClick={toggle}
      className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      title={collapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {collapsed ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        )}
      </svg>
    </button>
  )
}
