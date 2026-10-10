import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import logo from "../../assets/hero/logo.png";

const SOCIALS = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
]

const COLUMNS = [

]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-navy-100 bg-navy-900 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <logo />
              <span className="font-display text-xl font-bold text-ice">Ventidy</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Ventidy helps organizations close the loop on every complaint — logged,
              tracked, and resolved with full transparency.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-sky-400 hover:text-sky-400"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-ice">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/60 hover:text-sky-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-start-5">
            <h4 className="font-display text-sm font-semibold text-ice">Reach us</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-sky-400" />No:4B
                Erikkarai street,
                Ramamurthi nagar main road,
                Madipakkam, chennai 600091
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-sky-400" /> +91 9940110079
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-sky-400" /> Contact@ventidy.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Ventidy Technologies Pvt. Ltd. All rights reserved.</p>

        </div>
      </div>
    </footer>
  )
}
