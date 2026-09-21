import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import logo from "../../assets/hero/logo.png";

const NAV_LINKS = [
  { to: 'about', label: 'About' },
  { to: 'gallery', label: 'Services' },
  { to: 'services', label: 'Gallery' },
  { to: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    })
    setOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-soft' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center px-5 py-3 lg:px-8">

        {/* Logo */}
        <div
          onClick={() => scrollToSection("home")}
          className="cursor-pointer"
        >
          <img
            src={logo}
            alt="Ventidy"
            className="h-12 object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.to}
              onClick={() => scrollToSection(link.to)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors text-navy-600 hover:text-brand-600 dark:text-white/70 dark:hover:text-sky-400"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="ml-auto grid h-10 w-10 place-items-center rounded-full text-navy-700 dark:text-ice lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.to}
                  onClick={() => scrollToSection(link.to)}
                  className="rounded-xl px-4 py-3 text-left text-navy-700 hover:bg-brand-50 dark:text-white/80 dark:hover:bg-white/5"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}