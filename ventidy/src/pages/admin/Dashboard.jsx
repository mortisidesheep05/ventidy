import { ClipboardList, Clock, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import { ComplaintsPieChart, ComplaintsBarChart, ComplaintsLineChart } from '../../components/dashboard/Charts'
import { CardSkeleton, TableRowSkeleton } from '../../components/ui/Skeleton'
import { STATUS_STYLES, formatDate } from '../../utils/helpers'
import { useFetch } from '../../hooks/useFetch'
import complaintService from '../../services/complaintService'

export default function Dashboard() {
  const { data: stats, loading: statsLoading, error: statsError } = useFetch(complaintService.getStats, [])
  const { data: recent, loading: recentLoading, error: recentError } = useFetch(
    () => complaintService.list({ limit: 6, sort: '-createdAt' }),
    []
  )

  const recentComplaints = recent?.complaints || recent?.data || []

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-ice">Overview</h2>
        <p className="mt-1 text-sm text-navy-400 dark:text-white/40">Live snapshot of complaint activity.</p>
      </div>

      {statsError && (
        <div className="card flex items-center gap-3 border-l-4 border-amber-500 p-4 text-sm text-navy-500 dark:text-white/50">
          <AlertTriangle size={18} className="text-amber-500" />
          Couldn't reach the backend for live stats. Connect the API at{' '}
          <code className="font-mono text-xs">VITE_API_BASE_URL</code> to see real numbers.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={ClipboardList} label="Total Complaints" value={stats?.total ?? '—'} tone="brand" />
            <StatCard icon={Clock} label="Pending" value={stats?.pending ?? '—'} tone="amber" />
            <StatCard icon={Loader2} label="In Progress" value={stats?.inProgress ?? '—'} tone="brand" />
            <StatCard icon={CheckCircle2} label="Resolved" value={stats?.resolved ?? '—'} tone="teal" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <h3 className="font-display font-semibold text-navy-900 dark:text-ice">By Status</h3>
          {statsLoading ? (
            <CardSkeleton className="mt-4 h-64" />
          ) : (
            <div className="mt-4">
              <ComplaintsPieChart
                data={[
                  { label: 'Pending', value: stats?.pending ?? 0 },
                  { label: 'In Progress', value: stats?.inProgress ?? 0 },
                  { label: 'Resolved', value: stats?.resolved ?? 0 },
                  { label: 'Rejected', value: stats?.rejected ?? 0 },
                ]}
              />
            </div>
          )}
        </div>
        <div className="card p-6 lg:col-span-1">
          <h3 className="font-display font-semibold text-navy-900 dark:text-ice">By Category</h3>
          <div className="mt-4">
            <ComplaintsBarChart
              labels={stats?.byCategory?.map((c) => c.category) || []}
              values={stats?.byCategory?.map((c) => c.count) || []}
            />
          </div>
        </div>
        <div className="card p-6 lg:col-span-1">
          <h3 className="font-display font-semibold text-navy-900 dark:text-ice">Resolution Trend</h3>
          <div className="mt-4">
            <ComplaintsLineChart
              labels={stats?.trend?.map((t) => t.date) || []}
              values={stats?.trend?.map((t) => t.resolved) || []}
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="font-display font-semibold text-navy-900 dark:text-ice">Recent Complaints</h3>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-navy-100 text-xs uppercase tracking-wide text-navy-400 dark:border-white/10 dark:text-white/40">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Complainant</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50 dark:divide-white/5">
              {recentLoading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              ) : recentComplaints.length ? (
                recentComplaints.map((c) => (
                  <tr key={c.id} className="text-navy-700 dark:text-white/70">
                    <td className="px-6 py-4 font-mono text-xs">{c.id}</td>
                    <td className="px-4 py-4">{c.name}</td>
                    <td className="px-4 py-4">{c.category}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[c.status] || ''}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{formatDate(c.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-navy-400 dark:text-white/40">
                    {recentError ? 'Could not load recent complaints.' : 'No complaints yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
