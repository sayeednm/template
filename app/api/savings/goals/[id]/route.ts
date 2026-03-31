import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const goal = await prisma.savingGoal.findFirst({
    where: { id, userId: session.userId },
  })
  if (!goal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { title, targetAmount, deadline, emoji } = await req.json()

  const updated = await prisma.savingGoal.update({
    where: { id },
    data: {
      title: title ?? goal.title,
      targetAmount: targetAmount ?? goal.targetAmount,
      deadline: deadline ? new Date(deadline) : null,
      emoji: emoji ?? goal.emoji,
      isCompleted: (targetAmount ?? goal.targetAmount) <= goal.currentAmount,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const goal = await prisma.savingGoal.findFirst({
    where: { id, userId: session.userId },
  })
  if (!goal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.savingGoal.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
