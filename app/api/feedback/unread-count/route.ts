import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ count: 0 })
  }

  const count = await prisma.feedback.count({
    where: { status: 'unread' },
  })

  return NextResponse.json({ count })
}
