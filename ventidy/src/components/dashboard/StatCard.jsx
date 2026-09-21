import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, tone = 'brand', delta }) {
  const tones = {
    brand: 'from-brand-500 to-sky-400',
    amber: 'from-amber-500 to-orange-400',
    teal: 'from-teal-500 to-emerald-400',
    red: 'from-red-500 to-rose-400',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${tones[tone]} text-white`}>
          <Icon size={20} />
        </div>
        {delta && <span className="text-xs font-semibold text-teal-500">{delta}</span>}
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-navy-900 dark:text-ice">{value}</p>
      <p className="mt-1 text-sm text-navy-400 dark:text-white/40">{label}</p>
    </motion.div>
  )
}
