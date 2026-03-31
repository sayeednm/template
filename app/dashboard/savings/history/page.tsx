import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { formatRupiah } from '@/lib/utils'

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
    g.transactions.map((t) => ({ ...t, goalTitle: g.title, goalEmoji: g.emoji }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Riwayat Menabung</h1>
        <p className="text-slate-500 mt-1">Semua transaksi tabunganmu</p>
      </div>

      {allTransactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-slate-500">Belum ada riwayat transaksi</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {allTransactions.map((t, i) => (
            <div key={t.id} className={`flex items-center justify-between px-5 py-4 ${i !== allTransactions.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.goalEmoji ?? '🎯'}</span>
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.goalTitle}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {t.note && <p className="text-xs text-slate-500 italic">{t.note}</p>}
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-600">+{formatRupiah(t.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
