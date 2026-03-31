import { formatRupiah } from '@/lib/utils'

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
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Overview Statistik</h1>
        <p className="text-slate-500 mt-1">Ringkasan aktivitas seluruh sistem GoalSaver</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="Total Pengguna"
          value={totalUsers.toString()}
          sub="pengguna terdaftar"
          color="blue"
        />
        <StatCard
          icon="🎯"
          label="Total Target"
          value={totalGoals.toString()}
          sub="goal tabungan dibuat"
          color="violet"
        />
        <StatCard
          icon="💰"
          label="Total Saldo Virtual"
          value={formatRupiah(totalSaved)}
          sub="terkumpul di sistem"
          color="emerald"
        />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-700">Daftar Pengguna</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Role</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Goals</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Bergabung</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-700 font-medium">{user.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{user._count.savingGoals} goal</td>
                  <td className="px-6 py-3 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3">
                    <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
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

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    violet: 'from-violet-500 to-violet-600',
    emerald: 'from-emerald-500 to-emerald-600',
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  )
}
