import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

import ser1 from "../../assets/hero/nee_to_add/img11.jpeg"
import ser2 from "../../assets/hero/nee_to_add/img8.jpeg"
import ser3 from "../../assets/hero/nee_to_add/img6.jpeg"
import ser4 from "../../assets/hero/nee_to_add/img13.jpeg"

const REASONS = [
  {
    image: ser1,
    title: "Commercial Kitchen Exhaust Cleaning",
    desc:
      "Our comprehensive kitchen exhaust cleaning services ensure a safe and healthy environment by removing grease, grime, and debris from exhaust systems, reducing fire risks and improving airflow.",
  },
  {
    image: ser2,
    title: "AHU Coil Cleaning",
    desc:
      "We specialize in thorough AHU coil cleaning services that enhance the efficiency and performance of your air handling units, leading to improved indoor air quality, reduced energy consumption, and extended equipment lifespan.",
  },
  {
    image: ser3,
    title: "Duct Installation",
    desc:
      "Our expert technicians design and install duct systems tailored to your specific needs, ensuring efficient airflow, reduced energy losses, and compliance with industry standards.",
  },
  {
    image: ser4,
    title: "Repair & Maintenance",
    desc:
      "Our proactive repair and maintenance services help prevent costly breakdowns, optimize system performance, and extend the lifespan of your duct systems, motors & other electrical parts.",
  },
]

export default function WhyChoose() {
  const [expandedCard, setExpandedCard] = useState(null)
  const hoverTimer = useRef(null)

  const handleHoverStart = (index) => {
    hoverTimer.current = setTimeout(() => {
      setExpandedCard(index)
    }, 10)
  }

  const handleHoverEnd = () => {
    clearTimeout(hoverTimer.current)
    setExpandedCard(null)
  }

  return (
    <section
      className="bg-brand-50/60 py-20 dark:bg-white/[0.02]"
      id="gallery"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 text-3xl font-bold text-navy-900 dark:text-ice lg:text-4xl">
            Services We Offer
          </h2>
        </div>

        {/* Services */}
        <div className="mt-14 grid grid-cols-1 gap-6">

          {REASONS.map((r, i) => {
            const isExpanded = expandedCard === i

            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.25,
                  ease: "easeOut",
                }}
                onHoverStart={() => handleHoverStart(i)}
                onHoverEnd={handleHoverEnd}
                animate={{
                  scale: isExpanded ? 1.03 : 1,
                  y: isExpanded ? -15 : 0,
                }}
                className="service-card card relative z-10 flex w-full items-center gap-8 overflow-hidden p-6 transition-shadow duration-300 hover:shadow-glow"
              >

                                {/* IMAGE */}
                <motion.div
                  animate={{
                    width: isExpanded ? 360 : 192,
                    height: isExpanded ? 240 : 128,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="shrink-0 overflow-hidden rounded-xl"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                {/* TEXT */}
                <div className="min-w-0 flex-1">
                  <motion.h3
                    animate={{
                      fontSize: isExpanded ? "1.5rem" : "1.125rem",
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="font-display font-semibold text-navy-900 dark:text-ice"
                  >
                    {r.title}
                  </motion.h3>

                  <p className="mt-3 text-sm leading-relaxed text-navy-500 dark:text-white/50">
                    {r.desc}
                  </p>

                  {/* EXTRA CONTENT */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: isExpanded ? 1 : 0,
                      height: isExpanded ? "auto" : 0,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 text-sm leading-relaxed text-navy-500 dark:text-white/50">
                      Our system provides complete visibility throughout the
                      complaint process, allowing users to monitor progress
                      and stay informed until the issue is resolved.
                    </p>
                  </motion.div>
                </div>
                              </motion.div>
            )
          })}

        </div>
      </div>
    </section>
  )
}