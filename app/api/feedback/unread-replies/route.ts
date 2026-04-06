import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await verifySession()
  if (!session) return NextResponse.json({ count: 0 })

  // Hitung feedback milik user yang sudah dibalas tapi belum dilihat
  const count = await prisma.feedback.count({
    where: {
      userId: session.userId,
      status: 'replied',
      // Tandai "belum dilihat" dengan field baru — pakai workaround via updatedAt
      // Kita simpan "last seen" di localStorage sisi client
    },
  })

  return NextResponse.json({ count })
}
