import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { deleteAvatar, getFileNameFromUrl } from '@/lib/supabase'

export async function PUT(request: Request) {
  try {
    const session = await verifySession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    // Hapus foto profil
    if (body.fotoProfil === null) {
      const profile = await prisma.profile.findUnique({ where: { userId: session.userId } })
      if (profile?.fotoProfil) {
        const oldFileName = getFileNameFromUrl(profile.fotoProfil)
        if (oldFileName) await deleteAvatar(oldFileName)
      }
      await prisma.profile.update({ where: { userId: session.userId }, data: { fotoProfil: null } })
      return NextResponse.json({ success: true, message: 'Foto profil berhasil dihapus' })
    }

    // Update nama
    const { name } = body
    const profile = await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { name: name ?? null },
      create: { userId: session.userId, name: name ?? null },
    })

    return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui', profile })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
