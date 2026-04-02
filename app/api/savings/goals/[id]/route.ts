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

  const { title, targetAmount, deadline, emoji, isPaused, isArchived } = await req.json()

  let updateData: any = {
    title: title ?? goal.title,
    targetAmount: targetAmount ?? goal.targetAmount,
    deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : goal.deadline,
    emoji: emoji ?? goal.emoji,
    isCompleted: (targetAmount ?? goal.targetAmount) <= goal.currentAmount,
  }

  // Handle arsip
  if (isArchived !== undefined) {
    updateData = { isArchived }
    const updated = await prisma.savingGoal.update({ where: { id }, data: updateData })
    return NextResponse.json(updated)
  }

  // Handle pause/resume dengan deadline adjustment
  if (isPaused !== undefined) {
    if (isPaused && !goal.isPaused) {
      // Mulai jeda — simpan waktu jeda
      updateData.isPaused = true
      updateData.pausedAt = new Date()
    } else if (!isPaused && goal.isPaused && goal.pausedAt) {
      // Lanjutkan — hitung hari dijeda dan mundurkan deadline
      const pausedDays = Math.ceil(
        (new Date().getTime() - new Date(goal.pausedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      updateData.isPaused = false
      updateData.pausedAt = null
      if (goal.deadline) {
        const newDeadline = new Date(goal.deadline)
        newDeadline.setDate(newDeadline.getDate() + pausedDays)
        updateData.deadline = newDeadline
      }
    }
  }

  const updated = await prisma.savingGoal.update({
    where: { id },
    data: updateData,
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
