import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler)

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#64748b', font: { family: 'Inter', size: 12 } } },
    tooltip: {
      backgroundColor: '#0B1E3D',
      titleFont: { family: 'Space Grotesk' },
      bodyFont: { family: 'Inter' },
      padding: 10,
      cornerRadius: 8,
    },
  },
}

export function ComplaintsPieChart({ data }) {
  return (
    <div style={{ height: 260 }}>
      <Pie
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: ['#f59e0b', '#2563EB', '#10B981', '#ef4444'],
              borderWidth: 0,
            },
          ],
        }}
        options={baseOptions}
      />
    </div>
  )
}

export function ComplaintsBarChart({ labels, values }) {
  return (
    <div style={{ height: 280 }}>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Complaints',
              data: values,
              backgroundColor: '#2563EB',
              borderRadius: 8,
              maxBarThickness: 36,
            },
          ],
        }}
        options={{
          ...baseOptions,
          plugins: { ...baseOptions.plugins, legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b' } },
            y: { grid: { color: 'rgba(100,116,139,0.1)' }, ticks: { color: '#64748b' } },
          },
        }}
      />
    </div>
  )
}

export function ComplaintsLineChart({ labels, values }) {
  return (
    <div style={{ height: 280 }}>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Resolved',
              data: values,
              borderColor: '#38BDF8',
              backgroundColor: 'rgba(56,189,248,0.15)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#2563EB',
            },
          ],
        }}
        options={{
          ...baseOptions,
          plugins: { ...baseOptions.plugins, legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b' } },
            y: { grid: { color: 'rgba(100,116,139,0.1)' }, ticks: { color: '#64748b' } },
          },
        }}
      />
    </div>
  )
}
