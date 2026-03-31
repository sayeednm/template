import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await verifySession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ success: false, message: 'Data tidak valid' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 })

  const match = await compare(currentPassword, user.password)
  if (!match) return NextResponse.json({ success: false, message: 'Password saat ini salah' }, { status: 400 })

  const hashed = await hash(newPassword, 12)
  await prisma.user.update({ where: { id: session.userId }, data: { password: hashed } })

  return NextResponse.json({ success: true, message: 'Password berhasil diperbarui' })
}
