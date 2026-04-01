import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import FeedbackClient from './FeedbackClient'
import FAQ from '@/components/FAQ'

export default async function FeedbackPage() {
  const session = await verifySession()

  const feedbacks = await prisma.feedback.findMany({
    where: { userId: session!.userId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Hubungi Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Kirim pertanyaan atau laporan ke admin GoalSaver</p>
      </div>
      <div className="space-y-5">
        <FAQ />
        <FeedbackClient feedbacks={feedbacks} />
      </div>
    </div>
  )
}
