'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type User = { id: string; email: string; role: string; createdAt: Date }

export default function UserList({ users }: { users: User[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditEmail(user.email)
    setEditRole(user.role)
    setEditPassword('')
    setError('')
  }

  const handleSaveEdit = async (userId: string) => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/users/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email: editEmail, role: editRole, password: editPassword || undefined }),
    })
    const result = await res.json()
    if (result.success) { setEditingId(null); router.refresh() }
    else setError(result.message)
    setLoading(false)
  }

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Hapus akun "${email}"?\n\nSemua data goal dan transaksi user ini akan ikut terhapus.`)) return
    setLoading(true)
    const res = await fetch('/api/users/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const result = await res.json()
    if (result.success) router.refresh()
    else alert(result.message)
    setLoading(false)
  }

  if (users.length === 0) {
    return <div className="py-8 text-center text-slate-400 text-sm">Belum ada pengguna</div>
  }

  return (
    <div className="divide-y divide-slate-100">
      {users.map((user) => (
        <div key={user.id} className="px-5 py-4">
          {editingId === user.id ? (
            <div className="space-y-3">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Password Baru (opsional)</label>
                <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak diubah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                <div className="flex gap-3">
                  {['USER', 'ADMIN'].map(r => (
                    <label key={r} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" value={r} checked={editRole === r} onChange={e => setEditRole(e.target.value)} className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium text-slate-700">{r}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => handleSaveEdit(user.id)} disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-xl transition-colors disabled:opacity-50">
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button onClick={() => setEditingId(null)}
                  className="flex-1 border border-slate-200 text-slate-600 text-xs font-medium py-2 rounded-xl hover:bg-slate-50 transition-colors">
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${user.role === 'ADMIN' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {user.role === 'ADMIN' ? '🛡️ Admin' : '👤 User'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => handleEdit(user)} disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id, user.email)} disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
