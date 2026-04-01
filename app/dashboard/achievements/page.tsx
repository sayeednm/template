import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { formatRupiah } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default async function AchievementsPage() {
  const session = await verifySession()

  const completedGoals = await prisma.savingGoal.findMany({
    where: { userId: session!.userId, isCompleted: true },
    orderBy: { updatedAt: 'desc' },
    include: {
      transactions: { select: { createdAt: true }, orderBy: { createdAt: 'asc' }, take: 1 },
      _count: { select: { transactions: true } },
    },
  })

  const totalAchieved = completedGoals.reduce((sum, g) => sum + g.currentAmount, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-2xl font-bold text-slate-800">Capaianku</h1>
        <p className="text-slate-500 text-sm mt-1">Goal yang sudah berhasil kamu wujudkan!</p>
      </div>

      {completedGoals.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Belum ada capaian</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
            Selesaikan goal pertamamu dan lihat capaianmu di sini!
          </p>
          <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Lihat Goal Aktif
          </Link>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-white text-center col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold">{completedGoals.length}</p>
              <p className="text-xs text-yellow-100 mt-1">Goal Tercapai 🏆</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-lg font-bold text-emerald-600">{formatRupiah(totalAchieved)}</p>
              <p className="text-xs text-slate-500 mt-1">Total Ditabung</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-violet-600">
                {completedGoals.reduce((sum, g) => sum + g._count.transactions, 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total Deposit</p>
            </div>
          </div>

          {/* Trophy Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completedGoals.map((goal, index) => {
              const firstDeposit = goal.transactions[0]?.createdAt
              const daysToComplete = firstDeposit
                ? Math.ceil((new Date(goal.updatedAt).getTime() - new Date(firstDeposit).getTime()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <div key={goal.id} className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden relative">
                  {/* Rank badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Foto atau gradient */}
                  {goal.imageUrl ? (
                    <div className="relative h-36 overflow-hidden">
                      <Image src={goal.imageUrl} alt={goal.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-2xl">{goal.emoji ?? '🎯'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-20 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-4xl">{goal.emoji ?? '🎯'}</span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800">{goal.title}</h3>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          ✅ Tercapai!
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-50 rounded-xl p-2">
                        <p className="text-xs text-slate-500">Ditabung</p>
                        <p className="text-sm font-bold text-emerald-600">{formatRupiah(goal.currentAmount)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2">
                        <p className="text-xs text-slate-500">Deposit</p>
                        <p className="text-sm font-bold text-slate-700">{goal._count.transactions}x</p>
                      </div>
                    </div>

                    {daysToComplete && (
                      <p className="text-xs text-slate-400 text-center mt-2">
                        ⏱ Selesai dalam <span className="font-semibold text-slate-600">{daysToComplete} hari</span>
                      </p>
                    )}

                    <p className="text-xs text-slate-400 text-center mt-1">
                      {new Date(goal.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
