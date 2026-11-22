
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import logo from '../../assets/hero/logo.png'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      toast.error('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )

      toast.success('Welcome back!')
      navigate('/admin', { replace: true })

    } catch (error) {
      console.error('Firebase Login Error:', error.code, error.message)
      toast.error('Login failed: ' + error.code)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-ice dark:bg-navy-950 overflow-hidden font-body">

      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-40 dark:opacity-20" />

      {/* Top back navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy-600 hover:text-navy-900 dark:text-white/60 dark:hover:text-white px-3 py-2 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-navy-100 dark:border-white/10 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Ventidy Website
        </Link>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card p-7 sm:p-9 shadow-soft border border-navy-100/80 dark:border-white/10 bg-white/90 dark:bg-navy-900/90 backdrop-blur-2xl">

          {/* Logo & Title */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-40 w-40 items-center justify-center">
              <img
                src={logo}
                alt="Ventidy Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">
                Admin Login
              </h2>
              <p className="mt-1 text-sm text-navy-500 dark:text-white/50">
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">

            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400 dark:text-white/40">
                  <Mail size={16} />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="input-field !pl-10 !py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400 dark:text-white/40">
                  <Lock size={16} />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field !pl-10 !pr-10 !py-3 text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy-400 hover:text-navy-700 dark:text-white/40 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-navy-600 dark:text-white/60">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-navy-300 dark:border-white/20 text-brand-600 focus:ring-brand-500/20"
                />
                <span>Remember this session</span>
              </label>
            </div>

            <div className="h-4" />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 mt-5 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-navy-100 dark:border-white/10 text-center">
            <p className="text-[11px] text-navy-400 dark:text-white/40">
              Ventidy Solutions • Airflow, Cleanroom & HVAC Admin Console
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
