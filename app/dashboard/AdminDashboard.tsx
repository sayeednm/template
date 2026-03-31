import { formatRupiah } from '@/lib/utils'
import Link from 'next/link'

type User = {
  id: string
  email: string
  role: string
  createdAt: Date
  _count: { savingGoals: number }
}

type Props = {
  totalUsers: number
  totalGoals: number
  totalSaved: number
  recentUsers: User[]
}

export default function AdminDashboard({ totalUsers, totalGoals, totalSaved, recentUsers }: Props) {
  const adminCount = recentUsers.filter(u => u.role === 'ADMIN').length
  const userCount = recentUsers.filter(u => u.role === 'USER').length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">🛡️</div>
          <h1 className="text-2xl font-bold text-slate-800">Overview Statistik</h1>
        </div>
        <p className="text-slate-500 text-sm ml-11">Ringkasan aktivitas seluruh sistem GoalSaver</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="👥" label="Total Pengguna" value={totalUsers.toString()} sub={`${adminCount} admin · ${userCount} user`} gradient="from-blue-500 to-blue-700" />
        <StatCard icon="🎯" label="Total Goal" value={totalGoals.toString()} sub="goal tabungan dibuat" gradient="from-violet-500 to-violet-700" />
        <StatCard icon="💰" label="Total Terkumpul" value={formatRupiah(totalSaved)} sub="saldo virtual di sistem" gradient="from-emerald-500 to-emerald-700" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { href: '/dashboard/users', icon: '👥', label: 'Kelola Pengguna' },
          { href: '/dashboard/reports', icon: '📈', label: 'Laporan Global' },
          { href: '/dashboard/profile', icon: '👤', label: 'Profile Admin' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition-all group">
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">Pengguna Terbaru</h2>
            <p className="text-xs text-slate-400 mt-0.5">{totalUsers} total pengguna terdaftar</p>
          </div>
          <Link href="/dashboard/users" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Lihat semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Goals</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bergabung</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${user.role === 'ADMIN' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {user.role === 'ADMIN' ? '🛡️ Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 font-medium">{user._count.savingGoals}</span>
                    <span className="text-slate-400 text-xs ml-1">goal</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, gradient }: { icon: string; label: string; value: string; sub: string; gradient: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-sm`}>
            {icon}
          </div>
        </div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      </div>
    </div>
  )
}
