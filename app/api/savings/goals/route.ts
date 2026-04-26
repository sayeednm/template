import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { revalidateTag } from 'next/cache'

export async function GET() {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const goals = await prisma.savingGoal.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: { transactions: { orderBy: { createdAt: 'desc' } } },
  })

  return NextResponse.json(goals)
}

export async function POST(req: NextRequest) {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, targetAmount, deadline, emoji } = await req.json()
  if (!title || !targetAmount || targetAmount <= 0) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const goal = await prisma.savingGoal.create({
    data: {
      userId: session.userId,
      title,
      targetAmount,
      deadline: deadline ? new Date(deadline) : null,
      emoji: emoji ?? '🎯',
    },
  })

  revalidateTag('dashboard')
  return NextResponse.json(goal)
}
