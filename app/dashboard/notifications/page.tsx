import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import NotificationsClient from './NotificationsClient'

export default async function NotificationsPage() {
  const session = await verifySession()

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Pemberitahuan</h1>
        <p className="text-slate-500 text-sm mt-1">Pengumuman dan update dari admin GoalSaver</p>
      </div>
      <NotificationsClient announcements={announcements} />
    </div>
  )
}
