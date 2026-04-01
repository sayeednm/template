import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// User kirim feedback
export async function POST(req: NextRequest) {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject, message, category } = await req.json()
  if (!subject || !message) return NextResponse.json({ error: 'Subject dan pesan wajib diisi' }, { status: 400 })

  const feedback = await prisma.feedback.create({
    data: { userId: session.userId, subject, message, category: category ?? 'question' },
  })

  return NextResponse.json(feedback)
}

// User lihat feedback miliknya
export async function GET() {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const feedbacks = await prisma.feedback.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(feedbacks)
}
