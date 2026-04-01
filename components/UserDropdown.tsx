'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { logoutAction } from '@/app/actions/auth-actions'

type Props = {
  email: string
  name: string | null
  fotoProfil: string | null
  role: string
  isAdmin: boolean
}

export default function UserDropdown({ email, name, fotoProfil, role, isAdmin }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const accentColor = isAdmin ? 'from-blue-500 to-blue-600' : 'from-emerald-500 to-emerald-600'
  const displayName = name || email.split('@')[0]

  return (
    <div className="relative" ref={ref}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-colors"
      >
        {fotoProfil ? (
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm flex-shrink-0">
            <Image src={fotoProfil} alt="Profile" fill className="object-cover" sizes="36px" priority />
          </div>
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-slate-200 shadow-sm font-bold text-white text-sm flex-shrink-0 bg-gradient-to-br ${accentColor}`}>
            {email.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-semibold text-slate-700 leading-tight">{displayName}</span>
          <span className={`text-xs font-medium ${isAdmin ? 'text-blue-500' : 'text-emerald-500'}`}>
            {isAdmin ? 'Administrator' : 'Member'}
          </span>
        </div>
        <svg className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>

          {/* Menu items */}
          <div className="p-1.5 space-y-0.5">
            <Link href="/dashboard/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <span>👤</span> Profile
            </Link>
            <Link href="/dashboard/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <span>⚙️</span> Pengaturan
            </Link>
          </div>

          {/* Logout */}
          <div className="p-1.5 border-t border-slate-100">
            <form action={logoutAction}>
              <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                <span>🚪</span> Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
