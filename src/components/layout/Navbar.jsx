import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  PhoneCall
} from 'lucide-react'
import logo from "../../assets/hero/logo.png"

const NAV_LINKS = [
  { to: 'about', label: 'About SivaRK', icon: Building2 },
  { to: 'services', label: 'Services', icon: Sparkles },
  { to: 'gallery', label: 'Why Us', icon: ShieldCheck },
  { to: 'contact', label: 'Contact', icon: PhoneCall },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Detect active section on scroll
      const sections = ['contact', 'gallery', 'services', 'about', 'home']
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 160) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    })
    setOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'py-2.5 bg-white/85 dark:bg-navy-950/85 backdrop-blur-xl border-b border-navy-100/60 dark:border-white/10 shadow-[0_4px_30px_-5px_rgba(11,30,61,0.08)]'
        : 'py-4 bg-transparent'
        }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Brand / Logo */}
        <div
          onClick={() => scrollToSection("home")}
          className="cursor-pointer flex items-center gap-3 group transition-transform duration-200 active:scale-95"
        >
          <div className="relative">
            <img
              src={logo}
              alt="Ventidy Solutions"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-50/70 dark:bg-white/5 border border-navy-100/60 dark:border-white/10 backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.to
            return (
              <button
                key={link.to}
                onClick={() => scrollToSection(link.to)}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${isActive
                  ? 'text-brand-600 dark:text-sky-400 font-semibold'
                  : 'text-navy-700/80 hover:text-navy-900 dark:text-white/70 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10'
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-white dark:bg-navy-900 shadow-sm border border-brand-500/20 dark:border-sky-400/20 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </button>
            )
          })}
        </div>

        {/* Right Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Phone Chip */}
          {/* <a
            href="tel:+919940110079"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-navy-700 dark:text-ice bg-navy-50/80 dark:bg-white/5 border border-navy-100/70 dark:border-white/10 hover:border-brand-400 dark:hover:border-sky-400/40 transition-colors group"
            title="Call Ventidy Solutions"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-sky-400 group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-mono tracking-tight">+91 9940110079</span>
          </a> */}

          {/* Primary CTA */}
          {/* <button
            onClick={() => scrollToSection("contact")}
            className="relative inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 bg-gradient-to-r from-brand-600 via-blue-600 to-sky-500 hover:from-brand-700 hover:to-sky-600 shadow-[0_4px_16px_rgba(37,99,235,0.28)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.4)] active:scale-95 group overflow-hidden"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button> */}
        </div>

        {/* Mobile Action + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="tel:+919940110079"
            aria-label="Call Ventidy"
            className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-sky-400 border border-brand-100 dark:border-white/10"
          >
            <Phone className="h-4 w-4" />
          </a>

          <button
            className="grid h-9 w-9 place-items-center rounded-full bg-navy-50 text-navy-800 dark:bg-white/10 dark:text-ice border border-navy-100 dark:border-white/10 active:scale-95 transition-transform"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-navy-100/70 dark:border-white/10 bg-white/95 dark:bg-navy-950/95 backdrop-blur-2xl lg:hidden shadow-xl"
          >
            <div className="flex flex-col gap-1.5 px-5 py-4">
              {NAV_LINKS.map((link) => {
                const IconComponent = link.icon
                const isActive = activeSection === link.to
                return (
                  <button
                    key={link.to}
                    onClick={() => scrollToSection(link.to)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-sky-400 font-semibold'
                      : 'text-navy-700 hover:bg-navy-50/80 dark:text-white/80 dark:hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-4 w-4 opacity-75" />
                      <span>{link.label}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                  </button>
                )
              })}

              {/* Mobile CTA */}
              <div className="mt-3 pt-3 border-t border-navy-100/60 dark:border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand-600 via-blue-600 to-sky-500 shadow-md active:scale-98"
                >
                  <span>Request Free Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="tel:+919940110079"
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium text-navy-700 dark:text-ice bg-navy-50 dark:bg-white/5 border border-navy-100 dark:border-white/10"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-sky-400" />
                  <span>Call +91 9940110079</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}