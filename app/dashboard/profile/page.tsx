import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const session = await verifySession()
  if (!session) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: { id: true, fotoProfil: true, name: true },
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Pengaturan Akun</h1>
      <ProfileForm profile={profile} userEmail={session.email} userId={session.userId} />
    </div>
  )
}
