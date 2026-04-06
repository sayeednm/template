'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotificationBadge from '@/components/NotificationBadge'

type NavLink = { href: string; icon: string; label: string }

export default function ActiveSidebarNav({ links, isAdmin }: { links: NavLink[]; isAdmin: boolean }) {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        // Gunakan komponen khusus untuk Pemberitahuan
        if (link.href === '/dashboard/notifications') {
          return <NotificationBadge key={link.href} />
        }

        const isActive = link.href === '/dashboard'
          ? pathname === '/dashboard'
          : pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
              isActive
                ? isAdmin
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={`text-base transition-transform duration-150 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              {link.icon}
            </span>
            <span>{link.label}</span>
            {isActive && (
              <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            )}
          </Link>
        )
      })}
    </>
  )
}
