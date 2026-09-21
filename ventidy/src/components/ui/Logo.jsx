export default function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17" stroke="url(#ventidy-ring)" strokeWidth="3" strokeLinecap="round" strokeDasharray="80 26.9" />
      <path d="M13 20.5L18 25.5L27.5 15" stroke="url(#ventidy-check)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="ventidy-ring" x1="3" y1="3" x2="37" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="ventidy-check" x1="13" y1="15" x2="27.5" y2="25.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
    </svg>
  )
}
