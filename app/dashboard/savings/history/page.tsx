import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { formatRupiah } from '@/lib/utils'
import HistoryClient from './HistoryClient'

export default async function HistoryPage() {
  const session = await verifySession()

  const goals = await prisma.savingGoal.findMany({
    where: { userId: session!.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      transactions: { orderBy: { createdAt: 'desc' } },
    },
  })

  const allTransactions = goals.flatMap((g) =>
    g.transactions.map((t) => ({
      ...t,
      goalTitle: g.title,
      goalEmoji: g.emoji,
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Riwayat Menabung</h1>
        <p className="text-slate-500 mt-1 text-sm">{allTransactions.length} transaksi</p>
      </div>
      <HistoryClient transactions={allTransactions} />
    </div>
  )
}
