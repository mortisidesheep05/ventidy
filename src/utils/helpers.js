export const CATEGORIES = [
  'Product Quality',
  'Service Delay',
  'Billing Issue',
  'Staff Behavior',
  'Technical Fault',
  'Other',
]

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

export const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'In Progress': 'bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-sky-400',
  Resolved: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  Rejected: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400',
}

export const STATUS_PROGRESS = {
  Pending: 20,
  'In Progress': 60,
  Resolved: 100,
  Rejected: 100,
}

export function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function classNames(...values) {
  return values.filter(Boolean).join(' ')
}
