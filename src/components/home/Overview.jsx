import { motion } from 'framer-motion'

export default function Overview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8" id="about">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">Who we are</span>
          <h2 className="mt-2 sm:mt-3 text-2xl font-bold text-navy-900 dark:text-ice sm:text-3xl lg:text-4xl">
            About Ventidy
          </h2>

          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white/95 p-5 shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-white/10 dark:bg-white/5 sm:p-8 lg:p-10">
            <div className="mb-5 sm:mb-6 h-1 w-16 sm:w-20 rounded-full bg-brand-500"></div>

            <div className="space-y-4 sm:space-y-5 text-left text-[15px] leading-relaxed text-navy-600 dark:text-white/70 sm:text-base sm:leading-8 lg:text-lg">
              <p>
                <span className="font-semibold text-brand-600 dark:text-sky-400">
                  At Ventidy Solutions,
                </span>{' '}
                we're passionate about delivering top-notch duct cleaning services that exceed our customers' expectations. Based in Chennai, Tamil Nadu, we've built a reputation for quality, reliability, and commitment. Our team of 40+ trained and experienced technicians is dedicated to providing personalized cleaning solutions for commercial industries across India. From hospitality to manufacturing, we've had the privilege of serving esteemed organizations with our comprehensive range of services, including{' '}
                <strong className="font-semibold text-navy-900 dark:text-white">
                  Hood Cleaning, Kitchen Exhaust Duct Cleaning & Degreasing, Laundry Duct Cleaning, AHU Coil Cleaning,
                </strong>{' '}
                and{' '}
                <strong className="font-semibold text-navy-900 dark:text-white">
                  FCU Coil Cleaning.
                </strong>
              </p>

              <p>
                What sets us apart is our promise to deliver high-quality services at affordable costs, without compromising on care and commitment. We're building lasting relationships with our clients, backed by a strong foundation of trust, expertise, and a customer-centric approach.
              </p>

              <div className="mt-5 border-l-2 border-brand-500 pl-4 py-1 dark:border-sky-400">
                <p className="text-[15px] font-medium italic text-brand-600 dark:text-sky-400 sm:text-base lg:text-lg">
                  "With Ventidy Solutions, you can expect nothing but the best – from our technicians to our services, we've got you covered."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
