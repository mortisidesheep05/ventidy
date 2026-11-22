import { Outlet, useNavigate, Link } from 'react-router-dom'
import { LogOut, ExternalLink } from 'lucide-react'
import { toast } from 'react-toastify'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import logo from '../assets/hero/logo.png'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.info('Signed out successfully.')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Could not sign out. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-ice dark:bg-navy-950 font-body transition-colors">

      {/* Navbar */}
      <header className="glass sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 sm:px-8 border-b border-navy-100/70 dark:border-white/10">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Ventidy Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navbar Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl border border-navy-200 dark:border-white/10 text-navy-700 dark:text-white/80 hover:bg-navy-50 dark:hover:bg-white/5 transition-colors"
          >
            <ExternalLink size={15} />
            <span>Visit Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>

        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto p-5 sm:p-6 lg:p-8">
        <Outlet />
      </main>

    </div>
  )
}