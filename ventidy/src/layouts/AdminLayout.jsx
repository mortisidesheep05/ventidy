import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquareWarning,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'
import Logo from '../components/ui/Logo'
import { useTheme } from '../context/ThemeContext'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
const [open, setOpen] = useState(false)

const user = {
  name: "Admin",
  email: "admin@ventidy.com"
}

const logout = async () => {
  console.log("Logout disabled")
}

const { theme, toggleTheme } = useTheme()
const navigate = useNavigate()

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <Logo />
        <span className="font-display text-lg font-bold text-ice">Ventidy</span>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-brand-500 to-sky-400 text-white shadow-glow'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-sky-400 text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-white/40">{user?.email || 'admin@ventidy.com'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-red-400"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ice dark:bg-navy-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-navy-900 lg:block">{SidebarContent}</aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-navy-900">{SidebarContent}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="glass sticky top-0 z-30 flex items-center justify-between px-5 py-4 lg:px-8">
          <button className="lg:hidden text-navy-700 dark:text-ice" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <h1 className="font-display text-lg font-semibold text-navy-900 dark:text-ice">Admin Console</h1>
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full border border-navy-100 text-navy-600 dark:border-white/10 dark:text-white/70"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
