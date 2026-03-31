import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import { logoutAction } from '@/app/actions/auth-actions'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import FloatingChatbot from '@/components/FloatingChatbot'
import InstallPWA from '@/components/InstallPWA'
import MobileSidebar from '@/components/MobileSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifySession()
  if (!session) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: { fotoProfil: true },
  })

  const isAdmin = session.role === 'ADMIN'
  const accentColor = isAdmin ? 'blue' : 'emerald'

  return (
    <div className="min-h-screen bg-gray-50">
      <InstallPWA />

      {/* Navbar */}
      <nav className={`bg-white border-b shadow-sm border-${accentColor}-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <MobileSidebar role={session.role} />
              <div className="flex items-center gap-2">
                <span className="text-xl">{isAdmin ? '🛡️' : '🐷'}</span>
                <h1 className={`text-lg sm:text-xl font-bold text-${accentColor}-700`}>
                  {isAdmin ? 'GoalSaver Admin' : 'GoalSaver'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                {profile?.fotoProfil ? (
                  <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-${accentColor}-300 shadow-sm`}>
                    <Image src={profile.fotoProfil} alt="Profile" fill className="object-cover" sizes="40px" priority />
                  </div>
                ) : (
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-${accentColor}-500 to-${accentColor}-600 flex items-center justify-center border-2 border-${accentColor}-300 shadow-sm`}>
                    <span className="text-base sm:text-lg font-bold text-white">
                      {session.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{session.email}</span>
                  <span className={`text-xs font-semibold text-${accentColor}-600`}>
                    {isAdmin ? 'Administrator' : 'User'}
                  </span>
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
              <form action={logoutAction}>
                <button type="submit" className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 sm:px-3 py-2 rounded-md transition-colors">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r shadow-sm">
          <div className={`p-4 border-b border-${accentColor}-100 bg-${accentColor}-50`}>
            <p className={`text-xs font-semibold text-${accentColor}-600 uppercase tracking-wider`}>
              {isAdmin ? 'Admin Panel' : 'Menu Utama'}
            </p>
          </div>
          <nav className="p-4 space-y-1">
            {isAdmin ? (
              <>
                <SidebarLink href="/dashboard" icon="📊" label="Overview Statistik" color="blue" />
                <SidebarLink href="/dashboard/users" icon="👥" label="Manajemen Pengguna" color="blue" />
                <SidebarLink href="/dashboard/reports" icon="📈" label="Laporan Global" color="blue" />
                <SidebarLink href="/dashboard/profile" icon="👤" label="Profile" color="blue" />
              </>
            ) : (
              <>
                <SidebarLink href="/dashboard" icon="🏠" label="Dashboard Tabungan" color="emerald" />
                <SidebarLink href="/dashboard/savings/new" icon="➕" label="Tambah Target Baru" color="emerald" />
                <SidebarLink href="/dashboard/savings/history" icon="📋" label="Riwayat Menabung" color="emerald" />
                <SidebarLink href="/dashboard/profile" icon="👤" label="Profile" color="emerald" />
              </>
            )}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <FloatingChatbot />
    </div>
  )
}

function SidebarLink({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-${color}-50 hover:text-${color}-700 rounded-lg transition-all duration-200 group`}
    >
      <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}
