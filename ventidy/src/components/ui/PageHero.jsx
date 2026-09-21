import { motion } from 'framer-motion'

export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 lg:py-28">
      <div className="absolute inset-0 bg-grid-faint opacity-20" />
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl animate-blob" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-eyebrow text-sky-400"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-4xl font-bold text-ice lg:text-5xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-white/60"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
