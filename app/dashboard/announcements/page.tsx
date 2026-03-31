import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import AnnouncementManager from './AnnouncementManager'

export default async function AnnouncementsPage() {
  const session = await verifySession()
  if (session?.role !== 'ADMIN') redirect('/dashboard')

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">📢</div>
          <h1 className="text-2xl font-bold text-slate-800">Pengumuman</h1>
        </div>
        <p className="text-slate-500 text-sm ml-11">Kirim pengumuman atau update ke semua pengguna</p>
      </div>
      <AnnouncementManager announcements={announcements} />
    </div>
  )
}
