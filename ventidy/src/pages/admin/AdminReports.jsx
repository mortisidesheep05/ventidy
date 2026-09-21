import { Download } from 'lucide-react'
import { ComplaintsBarChart, ComplaintsLineChart, ComplaintsPieChart } from '../../components/dashboard/Charts'
import { useFetch } from '../../hooks/useFetch'
import complaintService from '../../services/complaintService'
import { CardSkeleton } from '../../components/ui/Skeleton'

export default function AdminReports() {
  const { data: stats, loading } = useFetch(complaintService.getStats, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-ice">Reports</h2>
          <p className="mt-1 text-sm text-navy-400 dark:text-white/40">Performance and volume trends across the platform.</p>
        </div>
        <button className="btn-secondary !px-4 !py-2 text-sm">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardSkeleton className="h-80" />
          <CardSkeleton className="h-80" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-display font-semibold text-navy-900 dark:text-ice">Complaints by Category</h3>
            <div className="mt-4">
              <ComplaintsBarChart
                labels={stats?.byCategory?.map((c) => c.category) || []}
                values={stats?.byCategory?.map((c) => c.count) || []}
              />
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-semibold text-navy-900 dark:text-ice">Status Breakdown</h3>
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
          </div>
          <div className="card p-6 lg:col-span-2">
            <h3 className="font-display font-semibold text-navy-900 dark:text-ice">Resolution Trend (last 30 days)</h3>
            <div className="mt-4">
              <ComplaintsLineChart
                labels={stats?.trend?.map((t) => t.date) || []}
                values={stats?.trend?.map((t) => t.resolved) || []}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
