import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Search, Trash2, UserCog, RefreshCcw } from 'lucide-react'
import { TableRowSkeleton } from '../../components/ui/Skeleton'
import { STATUS_STYLES, CATEGORIES, formatDate } from '../../utils/helpers'
import { useFetch } from '../../hooks/useFetch'
import complaintService from '../../services/complaintService'

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected']

export default function AdminComplaints() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  const { data, loading, refetch } = useFetch(
    () => complaintService.list({ search, category, status }),
    [search, category, status]
  )
  const complaints = useMemo(() => data?.complaints || data?.data || [], [data])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await complaintService.updateStatus(id, newStatus)
      toast.success('Status updated')
      refetch()
    } catch {
      toast.error('Could not update status')
    }
  }

  const handleAssign = async (id) => {
    const officerId = window.prompt('Enter officer ID or name to assign:')
    if (!officerId) return
    try {
      await complaintService.assignOfficer(id, officerId)
      toast.success('Officer assigned')
      refetch()
    } catch {
      toast.error('Could not assign officer')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint? This cannot be undone.')) return
    try {
      await complaintService.remove(id)
      toast.success('Complaint deleted')
      refetch()
    } catch {
      toast.error('Could not delete complaint')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-ice">Complaints</h2>
          <p className="mt-1 text-sm text-navy-400 dark:text-white/40">Search, filter, and manage every complaint.</p>
        </div>
        <button onClick={() => refetch()} className="btn-secondary !px-4 !py-2 text-sm">
          <RefreshCcw size={15} /> Refresh
        </button>
      </div>

      <div className="card flex flex-wrap gap-4 p-5">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or phone"
            className="input-field pl-10"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-auto min-w-[180px]">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field w-auto min-w-[160px]">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400 dark:border-white/10 dark:text-white/40">
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-4 py-4 font-medium">Complainant</th>
              <th className="px-4 py-4 font-medium">Category</th>
              <th className="px-4 py-4 font-medium">Priority</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Created</th>
              <th className="px-4 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50 dark:divide-white/5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
            ) : complaints.length ? (
              complaints.map((c) => (
                <tr key={c.id} className="text-navy-700 dark:text-white/70">
                  <td className="px-6 py-4 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-4">{c.name}</td>
                  <td className="px-4 py-4">{c.category}</td>
                  <td className="px-4 py-4">{c.priority}</td>
                  <td className="px-4 py-4">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${STATUS_STYLES[c.status] || ''}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-4">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAssign(c.id)}
                        title="Assign officer"
                        className="grid h-8 w-8 place-items-center rounded-lg text-brand-600 hover:bg-brand-50 dark:text-sky-400 dark:hover:bg-white/5"
                      >
                        <UserCog size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        title="Delete complaint"
                        className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-white/5"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-navy-400 dark:text-white/40">
                  No complaints match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
