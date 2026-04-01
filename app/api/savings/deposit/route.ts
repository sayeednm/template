import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { goalId, amount, note } = await req.json()
  if (!goalId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  // Pastikan goal milik user ini
  const goal = await prisma.savingGoal.findFirst({
    where: { id: goalId, userId: session.userId },
  })
  if (!goal) return NextResponse.json({ error: 'Goal not found' }, { status: 404 })

  const newAmount = goal.currentAmount + amount
  const isCompleted = newAmount >= goal.targetAmount

  const [transaction] = await prisma.$transaction([
    prisma.transaction.create({
      data: { goalId, amount, note: note ?? null },
    }),
    prisma.savingGoal.update({
      where: { id: goalId },
      data: { currentAmount: newAmount, isCompleted },
    }),
  ])

  return NextResponse.json({ success: true, transaction, goalCompleted: isCompleted })
}
