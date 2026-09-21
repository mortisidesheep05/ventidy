import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import CTABanner from '../components/ui/CTABanner'
import { SERVICES } from '../components/home/ServicesPreview'

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="What we offer"
        title="Services built around resolution"
        description="From intake to escalation, Ventidy covers every step a complaint takes on its way to being closed."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
              className="card group flex flex-col p-7 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-white/5 dark:text-sky-400">
                <s.icon size={22} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-900 dark:text-ice">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500 dark:text-white/50">{s.desc}</p>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-sky-400"
              >
                Learn more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  )
}
