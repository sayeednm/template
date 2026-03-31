'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = { role: string }

export default function MobileSidebar({ role }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isAdmin = role === 'ADMIN'

  const userLinks = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/dashboard/savings/new', icon: '➕', label: 'Tambah Target' },
    { href: '/dashboard/savings/history', icon: '📋', label: 'Riwayat' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
    { href: '/dashboard/settings', icon: '⚙️', label: 'Pengaturan' },
  ]

  const adminLinks = [
    { href: '/dashboard', icon: '📊', label: 'Overview' },
    { href: '/dashboard/users', icon: '👥', label: 'Pengguna' },
    { href: '/dashboard/reports', icon: '📈', label: 'Laporan' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
  ]

  const links = isAdmin ? adminLinks : userLinks

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-base">💰</div>
            <span className="font-bold text-slate-800">GoalSaver</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-2 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{isAdmin ? 'Admin Panel' : 'Menu'}</p>
        </div>

        <nav className="p-3 space-y-0.5">
          {links.map((link) => {
            const isActive = link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href)
            return (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? isAdmin ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}>
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
                {isActive && <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-blue-500' : 'bg-emerald-500'}`} />}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
