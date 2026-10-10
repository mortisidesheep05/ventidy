import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import Logo from '../components/ui/Logo'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-navy-900 px-5 text-center">
      <div className="absolute inset-0 bg-grid-faint opacity-20" />
      <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl animate-blob" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <Logo className="mx-auto h-14 w-14" />
        <h1 className="mt-6 font-display text-6xl font-bold text-ice">404</h1>
        <p className="mt-2 text-white/60">This page couldn't be found or resolved.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          <Home size={18} /> Back to Home
        </Link>
      </motion.div>
    </section>
  )
}
