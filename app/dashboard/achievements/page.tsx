import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import AchievementsClient from './AchievementsClient'

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

  return <AchievementsClient goals={completedGoals} />
}
