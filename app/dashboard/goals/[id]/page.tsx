import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'
import GoalDetailClient from './GoalDetailClient'

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await verifySession()
  if (!session) redirect('/login')

  const goal = await prisma.savingGoal.findFirst({
    where: { id, userId: session.userId },
    include: { transactions: { orderBy: { createdAt: 'desc' } } },
  })

  if (!goal) notFound()
  return <GoalDetailClient goal={goal} />
}
