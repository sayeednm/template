import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import { logoutAction } from '@/app/actions/auth-actions'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import FloatingChatbot from '@/components/FloatingChatbot'
import InstallPWA from '@/components/InstallPWA'
import MobileSidebar from '@/components/MobileSidebar'
import ActiveSidebarNav from '@/components/ActiveSidebarNav'
import DarkModeProvider from '@/components/DarkModeProvider'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession()
  if (!session) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: { fotoProfil: true, name: true },
  })

  const isAdmin = session.role === 'ADMIN'

  const userLinks = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/dashboard/savings/new', icon: '➕', label: 'Tambah Target' },
    { href: '/dashboard/savings/history', icon: '📋', label: 'Riwayat' },
    { href: '/dashboard/achievements', icon: '🏆', label: 'Capaianku' },
    { href: '/dashboard/feedback', icon: '💬', label: 'Hubungi Admin' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
    { href: '/dashboard/settings', icon: '⚙️', label: 'Pengaturan' },
  ]

  const adminLinks = [
    { href: '/dashboard', icon: '📊', label: 'Overview' },
    { href: '/dashboard/users', icon: '👥', label: 'Pengguna' },
    { href: '/dashboard/announcements', icon: '📢', label: 'Pengumuman' },
    { href: '/dashboard/admin-feedback', icon: '💬', label: 'Pesan Masuk' },
    { href: '/dashboard/reports', icon: '📈', label: 'Laporan' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
  ]

  const links = isAdmin ? adminLinks : userLinks

  return (
    <DarkModeProvider>
    <div className="min-h-screen bg-slate-50">
      <InstallPWA />

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <MobileSidebar role={session.role} />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-base">💰</div>
                <span className={`text-lg font-bold ${isAdmin ? 'text-blue-700' : 'text-emerald-700'}`}>
                  GoalSaver{isAdmin ? ' Admin' : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                {profile?.fotoProfil ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm">
                    <Image src={profile.fotoProfil} alt="Profile" fill className="object-cover" sizes="36px" priority />
                  </div>
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-slate-200 shadow-sm font-bold text-white text-sm ${isAdmin ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'}`}>
                    {session.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold text-slate-700 leading-tight">
                    {profile?.name || session.email.split('@')[0]}
                  </span>
                  <span className={`text-xs font-medium ${isAdmin ? 'text-blue-500' : 'text-emerald-500'}`}>
                    {isAdmin ? 'Administrator' : 'Member'}
                  </span>
                </div>
              </div>
              <div className="hidden sm:block h-6 w-px bg-slate-200" />
              <form action={logoutAction}>
                <button type="submit" className="text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-60 bg-white border-r border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {isAdmin ? 'Admin Panel' : 'Menu'}
            </p>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            <ActiveSidebarNav links={links} isAdmin={isAdmin} />
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <FloatingChatbot />
    </div>
    </DarkModeProvider>
  )
}
