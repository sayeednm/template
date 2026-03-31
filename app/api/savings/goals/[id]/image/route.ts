import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { uploadGoalImage, deleteGoalImage } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const goal = await prisma.savingGoal.findFirst({
    where: { id, userId: session.userId },
  })
  if (!goal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type))
    return NextResponse.json({ error: 'Format tidak didukung. Gunakan JPG, PNG, atau WebP.' }, { status: 400 })

  if (file.size > 3 * 1024 * 1024)
    return NextResponse.json({ error: 'Ukuran file maksimal 3MB.' }, { status: 400 })

  if (goal.imageUrl) {
    const match = goal.imageUrl.match(/\/goal-images\/(.+?)(?:\?|$)/)
    if (match?.[1]) await deleteGoalImage(match[1])
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()
  const fileName = `${session.userId}-${id}.${ext}`

  const result = await uploadGoalImage(buffer, fileName, file.type)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })

  await prisma.savingGoal.update({
    where: { id },
    data: { imageUrl: result.url },
  })

  return NextResponse.json({ success: true, url: result.url })
}
