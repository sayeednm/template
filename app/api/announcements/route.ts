import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// GET — semua user bisa ambil pengumuman
export async function GET() {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return NextResponse.json(announcements)
}

// POST — hanya ADMIN
export async function POST(req: NextRequest) {
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { title, content, type } = await req.json()
  if (!title || !content) {
    return NextResponse.json({ error: 'Title dan content wajib diisi' }, { status: 400 })
  }

  const announcement = await prisma.announcement.create({
    data: { title, content, type: type ?? 'info' },
  })

  return NextResponse.json(announcement)
}
