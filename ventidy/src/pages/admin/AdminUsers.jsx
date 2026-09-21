import { useState } from 'react'
import { toast } from 'react-toastify'
import { Search, Trash2 } from 'lucide-react'
import { TableRowSkeleton } from '../../components/ui/Skeleton'
import { formatDate } from '../../utils/helpers'
import { useFetch } from '../../hooks/useFetch'
import userService from '../../services/userService'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const { data, loading, refetch } = useFetch(() => userService.list({ search }), [search])
  const users = data?.users || data?.data || []

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this user account?')) return
    try {
      await userService.remove(id)
      toast.success('User removed')
      refetch()
    } catch {
      toast.error('Could not remove user')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-ice">Users</h2>
        <p className="mt-1 text-sm text-navy-400 dark:text-white/40">Everyone with a Ventidy account.</p>
      </div>

      <div className="card p-5">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email"
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400 dark:border-white/10 dark:text-white/40">
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-4 py-4 font-medium">Email</th>
              <th className="px-4 py-4 font-medium">Phone</th>
              <th className="px-4 py-4 font-medium">Role</th>
              <th className="px-4 py-4 font-medium">Joined</th>
              <th className="px-4 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50 dark:divide-white/5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
            ) : users.length ? (
              users.map((u) => (
                <tr key={u.id} className="text-navy-700 dark:text-white/70">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-4 py-4">{u.email}</td>
                  <td className="px-4 py-4">{u.phone}</td>
                  <td className="px-4 py-4 capitalize">{u.role}</td>
                  <td className="px-4 py-4">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-navy-400 dark:text-white/40">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
