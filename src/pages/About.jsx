import { motion } from 'framer-motion'
import { Target, Eye, HeartHandshake, Award, Sparkles, ShieldCheck, Users } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import CTABanner from '../components/ui/CTABanner'

const VALUES = [
  { icon: ShieldCheck, title: 'Accountability', desc: 'Every complaint has a named owner from start to finish.' },
  { icon: Sparkles, title: 'Transparency', desc: 'Status updates are visible, not hidden behind a support queue.' },
  { icon: HeartHandshake, title: 'Empathy', desc: 'Behind every complaint is a person who deserves to be heard.' },
  { icon: Users, title: 'Collaboration', desc: 'We build with the teams who use Ventidy every day.' },
]

const TEAM = [
  { name: 'Rohan Sharma', role: 'Founder & CEO', initials: 'RS' },
  { name: 'Kavya Iyer', role: 'Head of Product', initials: 'KI' },
  { name: 'Michael Chen', role: 'Head of Engineering', initials: 'MC' },
  { name: 'Fatima Sheikh', role: 'Head of Customer Success', initials: 'FS' },
]

const TIMELINE = [
  { year: '2021', title: 'Ventidy founded', desc: 'Started as a complaint tracker for a single municipal client.' },
  { year: '2022', title: 'Platform launch', desc: 'Public launch with automated routing and live tracking.' },
  { year: '2023', title: '100 organizations', desc: 'Crossed 100 organizations and 50,000 resolved complaints.' },
  { year: '2025', title: 'Analytics suite', desc: 'Introduced dashboards, reporting, and officer performance tracking.' },
  { year: '2026', title: '340+ organizations', desc: 'Now serving retail, utilities, and government grievance offices.' },
]

const ACHIEVEMENTS = [
  { icon: Award, stat: '96%', label: 'Customer satisfaction' },
  { icon: Target, stat: '128K+', label: 'Complaints resolved' },
  { icon: Eye, stat: '36 hrs', label: 'Average resolution time' },
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Ventidy"
        title="Making complaint resolution accountable"
        description="We build the infrastructure organizations need to hear, route, and resolve complaints without losing the trail."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-400 text-white">
              <Target size={22} />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-navy-900 dark:text-ice">Our Mission</h3>
            <p className="mt-3 leading-relaxed text-navy-500 dark:text-white/60">
              To give every organization a clear, accountable system for turning complaints
              into resolved outcomes — so no issue is raised and forgotten.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card p-8"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-400 text-white">
              <Eye size={22} />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-navy-900 dark:text-ice">Our Vision</h3>
            <p className="mt-3 leading-relaxed text-navy-500 dark:text-white/60">
              A world where filing a complaint feels productive, not futile — where every
              user can see exactly where their issue stands, at every step.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-brand-50/60 py-20 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">What we stand for</span>
            <h2 className="mt-3 text-3xl font-bold text-navy-900 dark:text-ice lg:text-4xl">Our Values</h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-white/5 dark:text-sky-400">
                  <v.icon size={22} />
                </div>
                <h3 className="mt-4 font-display font-semibold text-navy-900 dark:text-ice">{v.title}</h3>
                <p className="mt-2 text-sm text-navy-500 dark:text-white/50">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">The people behind Ventidy</span>
          <h2 className="mt-3 text-3xl font-bold text-navy-900 dark:text-ice lg:text-4xl">Our Team</h2>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 text-center"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-sky-400 font-display text-lg font-bold text-white">
                {m.initials}
              </div>
              <h3 className="mt-4 font-display font-semibold text-navy-900 dark:text-ice">{m.name}</h3>
              <p className="text-sm text-navy-400 dark:text-white/40">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-brand-50/60 py-20 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Our journey</span>
            <h2 className="mt-3 text-3xl font-bold text-navy-900 dark:text-ice lg:text-4xl">Timeline</h2>
          </div>
          <div className="relative mt-14 space-y-10 border-l-2 border-brand-200 pl-8 dark:border-white/10">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <span className="absolute -left-[38px] grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-sky-400 text-[10px] font-bold text-white">
                  •
                </span>
                <p className="font-mono text-sm font-semibold text-brand-600 dark:text-sky-400">{t.year}</p>
                <h3 className="mt-1 font-display font-semibold text-navy-900 dark:text-ice">{t.title}</h3>
                <p className="mt-1 text-sm text-navy-500 dark:text-white/50">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ACHIEVEMENTS.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card flex flex-col items-center p-8 text-center"
            >
              <a.icon className="text-brand-500 dark:text-sky-400" size={30} />
              <p className="mt-3 font-display text-3xl font-bold text-navy-900 dark:text-ice">{a.stat}</p>
              <p className="mt-1 text-sm text-navy-500 dark:text-white/50">{a.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  )
}
