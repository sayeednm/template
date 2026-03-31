import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Pastikan transaksi milik user ini
  const transaction = await prisma.transaction.findFirst({
    where: { id },
    include: { goal: { select: { userId: true, currentAmount: true } } },
  })

  if (!transaction) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (transaction.goal.userId !== session.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Kurangi currentAmount goal
  const newAmount = Math.max(0, transaction.goal.currentAmount - transaction.amount)

  await prisma.$transaction([
    prisma.transaction.delete({ where: { id } }),
    prisma.savingGoal.update({
      where: { id: transaction.goalId },
      data: {
        currentAmount: newAmount,
        isCompleted: false, // reset completed jika ada transaksi dihapus
      },
    }),
  ])

  return NextResponse.json({ success: true })
}
