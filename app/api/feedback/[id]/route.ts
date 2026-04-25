import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// Admin hapus feedback
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.feedback.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

// Admin balas feedback
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { reply, status } = await req.json()

  const feedback = await prisma.feedback.update({
    where: { id },
    data: {
      reply: reply ?? undefined,
      status: status ?? 'read',
      updatedAt: new Date(),
    },
  })

  return NextResponse.json(feedback)
}
