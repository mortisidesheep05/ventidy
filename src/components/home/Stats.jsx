import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, { duration: 1.5 })

  useEffect(() => {
    if (isInView) motionVal.set(to)
  }, [isInView, to, motionVal])

  useEffect(() => {
    return springVal.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.floor(v).toLocaleString() + suffix
    })
  }, [springVal, suffix])

  return <span ref={ref}>0{suffix}</span>
}

const STATS = [
  { value: 40, suffix: '+', label: 'Trained Technicians' },
  { value: 'Pan India', type: 'text', label: 'Service Coverage' },
  { value: 5, suffix: '+', label: 'Specialized Services' },
  { value: '100%', type: 'text', label: 'Quality Commitment' },
]
export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20">
      <div className="absolute inset-0 bg-grid-faint opacity-20" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-4xl font-bold text-ice lg:text-5xl">
                {s.type === 'text' ? s.value : <Counter to={s.value} suffix={s.suffix} />}
              </p>
              <p className="mt-2 text-sm text-white/50">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
