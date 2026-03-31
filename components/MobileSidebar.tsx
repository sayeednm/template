'use client';

import { useState } from 'react';
import Link from 'next/link';

type MobileSidebarProps = { role: string };

export default function MobileSidebar({ role }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = role === 'ADMIN';
  const color = isAdmin ? 'blue' : 'emerald';

  const userLinks = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard Tabungan' },
    { href: '/dashboard/savings/new', icon: '➕', label: 'Tambah Target Baru' },
    { href: '/dashboard/savings/history', icon: '📋', label: 'Riwayat Menabung' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
  ];

  const adminLinks = [
    { href: '/dashboard', icon: '📊', label: 'Overview Statistik' },
    { href: '/dashboard/users', icon: '👥', label: 'Manajemen Pengguna' },
    { href: '/dashboard/reports', icon: '📈', label: 'Laporan Global' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-lg z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`p-4 border-b bg-${color}-50 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{isAdmin ? '🛡️' : '🐷'}</span>
            <h2 className={`font-bold text-${color}-700`}>GoalSaver</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`px-4 py-2 bg-${color}-50 border-b`}>
          <p className={`text-xs font-semibold text-${color}-600 uppercase tracking-wider`}>
            {isAdmin ? 'Admin Panel' : 'Menu Utama'}
          </p>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-${color}-50 hover:text-${color}-700 rounded-lg transition-colors`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
