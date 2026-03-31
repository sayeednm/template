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
  const completed = goals.filter((g) => g.isCompleted).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Laporan Global</h1>
        <p className="text-slate-500 mt-1">Semua goal tabungan di sistem</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-800">{goals.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Goal</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{completed}</p>
          <p className="text-xs text-slate-500 mt-1">Tercapai</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{goals.length - completed}</p>
          <p className="text-xs text-slate-500 mt-1">Aktif</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
          <p className="text-sm font-bold text-slate-800">{formatRupiah(totalSaved)}</p>
          <p className="text-xs text-slate-500 mt-1">Total Terkumpul</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-700">Semua Goal Tabungan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Goal</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">User</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Progress</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Terkumpul</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => {
                const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                return (
                  <tr key={goal.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <span className="mr-2">{goal.emoji}</span>
                      <span className="font-medium text-slate-700">{goal.title}</span>
                    </td>
                    <td className="px-6 py-3 text-slate-500 text-xs">{goal.user.email}</td>
                    <td className="px-6 py-3 w-32">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{pct.toFixed(0)}%</span>
                    </td>
                    <td className="px-6 py-3 text-emerald-600 font-medium">{formatRupiah(goal.currentAmount)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${goal.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
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
