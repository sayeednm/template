import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import FloatingChatbot from '@/components/FloatingChatbot'
import InstallPWA from '@/components/InstallPWA'
import MobileSidebar from '@/components/MobileSidebar'
import ActiveSidebarNav from '@/components/ActiveSidebarNav'
import DarkModeProvider from '@/components/DarkModeProvider'
import UserDropdown from '@/components/UserDropdown'
import SidebarToggle from '@/components/SidebarToggle'

// Cache profile query — revalidate setiap 60 detik
const getProfile = unstable_cache(
  async (userId: string) => {
    return prisma.profile.findUnique({
      where: { userId },
      select: { fotoProfil: true, name: true },
    })
  },
  ['user-profile'],
  { revalidate: 60 }
)

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession()
  if (!session) redirect('/login')

  const profile = await getProfile(session.userId)

  const isAdmin = session.role === 'ADMIN'

  const userLinks = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/dashboard/savings/new', icon: '➕', label: 'Tambah Target' },
    { href: '/dashboard/savings/history', icon: '📋', label: 'Riwayat' },
    { href: '/dashboard/achievements', icon: '🏆', label: 'Capaianku' },
    { href: '/dashboard/notifications', icon: '🔔', label: 'Pemberitahuan' },
    { href: '/dashboard/feedback', icon: '💬', label: 'Hubungi Admin' },
    { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
    { href: '/dashboard/settings', icon: '⚙️', label: 'Pengaturan' },
    { href: '/dashboard/about', icon: 'ℹ️', label: 'Tentang App' },
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
              <SidebarToggle />
            </div>
            <div className="flex items-center gap-3">
              <UserDropdown
                email={session.email}
                name={profile?.name ?? null}
                fotoProfil={profile?.fotoProfil ?? null}
                role={session.role}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="dashboard-sidebar hidden lg:flex lg:flex-col w-60 bg-white border-r border-slate-200 shadow-sm overflow-hidden">
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
