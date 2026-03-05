import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  // Optimasi: hanya ambil field yang dibutuhkan
  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: {
      id: true,
      fotoProfil: true,
    },
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Profile Saya</h1>
        
        <ProfileForm 
          profile={profile} 
          userEmail={session.email}
        />
      </div>
    </div>
  )
}
