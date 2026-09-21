export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-navy-100/70 dark:bg-white/5 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="card p-6">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-5/6" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}
