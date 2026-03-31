import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import CreateUserForm from './CreateUserForm'
import UserList from './UserList'

export default async function UsersPage() {
  const session = await verifySession()
  if (!session || session.role !== 'ADMIN') redirect('/dashboard')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  const adminCount = users.filter(u => u.role === 'ADMIN').length
  const userCount = users.filter(u => u.role === 'USER').length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">👥</div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
        </div>
        <p className="text-slate-500 text-sm ml-11">{users.length} pengguna · {adminCount} admin · {userCount} user</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold text-slate-800 text-sm">Tambah Pengguna Baru</h2>
            </div>
            <div className="p-5">
              <CreateUserForm />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold text-slate-800 text-sm">Daftar Pengguna</h2>
            </div>
            <UserList users={users} />
          </div>
        </div>
      </div>
    </div>
  )
}
