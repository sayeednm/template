import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// Cache untuk 60 detik
export const revalidate = 60

// GET - Get current user profile
export async function GET() {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Optimasi: hanya ambil field yang dibutuhkan
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      select: {
        id: true,
        fotoProfil: true,
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
