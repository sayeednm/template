import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { formatRupiah } from '@/lib/utils'

export default async function ReportsPage() {
  const session = await verifySession()
  if (session?.role !== 'ADMIN') redirect('/dashboard')

  const goals = await prisma.savingGoal.findMany({
    orderBy: { currentAmount: 'desc' },
    include: {
      user: { select: { email: true } },
      _count: { select: { transactions: true } },
    },
  })

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const completed = goals.filter((g) => g.isCompleted).length
  const active = goals.length - completed
  const overallPct = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">📈</div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Global</h1>
        </div>
        <p className="text-slate-500 text-sm ml-11">Semua aktivitas tabungan di sistem GoalSaver</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Goal', value: goals.length.toString(), color: 'text-slate-800', bg: 'bg-slate-50' },
          { label: 'Tercapai', value: completed.toString(), color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Aktif', value: active.toString(), color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Terkumpul', value: formatRupiah(totalSaved), color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-slate-200`}>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Progress Keseluruhan Sistem</p>
          <span className="text-sm font-bold text-blue-600">{overallPct.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>Terkumpul: {formatRupiah(totalSaved)}</span>
          <span>Target: {formatRupiah(totalTarget)}</span>
        </div>
      </div>

      {/* Goals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-semibold text-slate-800">Semua Goal Tabungan</h2>
          <p className="text-xs text-slate-400 mt-0.5">{goals.length} goal dari seluruh pengguna</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Goal</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Terkumpul</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {goals.map((goal) => {
                const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                return (
                  <tr key={goal.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{goal.emoji}</span>
                        <span className="font-medium text-slate-700 truncate max-w-[140px]">{goal.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs truncate max-w-[140px]">{goal.user.email}</td>
                    <td className="px-6 py-4 w-36">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <div className={`h-full rounded-full ${goal.isCompleted ? 'bg-emerald-400' : 'bg-blue-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{pct.toFixed(0)}%</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">{formatRupiah(goal.currentAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${goal.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {goal.isCompleted ? '✅ Selesai' : '🔵 Aktif'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
