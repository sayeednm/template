import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'

export default async function DashboardPage() {
  const session = await verifySession()

  if (session?.role === 'ADMIN') {
    const [totalUsers, totalGoals, totalSaved, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.savingGoal.count(),
      prisma.savingGoal.aggregate({ _sum: { currentAmount: true } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { savingGoals: true } },
        },
      }),
    ])

    return (
      <AdminDashboard
        totalUsers={totalUsers}
        totalGoals={totalGoals}
        totalSaved={totalSaved._sum.currentAmount ?? 0}
        recentUsers={recentUsers}
      />
    )
  }

  // User: ambil goals milik user ini saja
  const [goals, profile, announcements] = await Promise.all([
    prisma.savingGoal.findMany({
      where: { userId: session!.userId },
      orderBy: { createdAt: 'desc' },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 3 } },
    }),
    prisma.profile.findUnique({
      where: { userId: session!.userId },
      select: { name: true },
    }),
    prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return <UserDashboard goals={goals} userId={session!.userId} email={session!.email} name={profile?.name ?? null} announcements={announcements} />
}
