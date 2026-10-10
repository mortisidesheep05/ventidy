import { motion } from 'framer-motion'

export default function Overview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8" id="about">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Who we are</span>
          <h2 className="mt-3 text-3xl font-bold text-navy-900 dark:text-ice lg:text-4xl">
            About Ventidy
          </h2>
<div className="mt-8 rounded-3xl border border-gray-200 bg-white/90 p-10 shadow-2xl transition-all duration-300 hover:shadow-3xl dark:border-white/10 dark:bg-white/5">

  <div className="mb-6 h-1 w-20 rounded-full bg-brand-500"></div>

  <p className="text-lg leading-9 text-navy-600 dark:text-white/70">
    <span className="font-semibold text-brand-600 dark:text-sky-400">
      At Ventidy Solutions,
    </span>{" "}
    we're passionate about delivering top-notch duct cleaning services that exceed our customers' expectations. Based in Chennai, Tamil Nadu, we've built a reputation for quality, reliability, and commitment. Our team of 40+ trained and experienced technicians is dedicated to providing personalized cleaning solutions for commercial industries across India. From hospitality to manufacturing, we've had the privilege of serving esteemed organizations with our comprehensive range of services, including <strong>Hood Cleaning, Kitchen Exhaust Duct Cleaning & Degreasing, Laundry Duct Cleaning, AHU Coil Cleaning,</strong> and <strong>FCU Coil Cleaning.</strong>
  </p>

  <p className="mt-8 indent-8 text-lg leading-9 text-navy-600 dark:text-white/70">
    What sets us apart is our promise to deliver high-quality services at affordable costs, without compromising on care and commitment. We're building lasting relationships with our clients, backed by a strong foundation of trust, expertise, and a customer-centric approach.
  </p>

  <p className="mt-6 text-lg font-medium italic text-brand-600 dark:text-sky-400">
    "With Ventidy Solutions, you can expect nothing but the best – from our technicians to our services, we've got you covered."
  </p>

</div>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { label: 'Organizations served', value: '340+' },
            { label: 'Complaints resolved', value: '128K+' },
            { label: 'Avg. resolution time', value: '36 hrs' },
            { label: 'Satisfaction rate', value: '96%' },
          ].map((stat, i) => (
            <div key={stat.label} className={`card p-6 ${i % 2 === 1 ? 'mt-6' : ''}`}>
              <p className="font-display text-3xl font-bold text-brand-600 dark:text-sky-400">{stat.value}</p>
              <p className="mt-1 text-sm text-navy-500 dark:text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div> */}
      </div>
    </section>
  )
}
