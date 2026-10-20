import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileEdit, Search } from 'lucide-react'
import ResolutionRing from '../ui/ResolutionRing'

import { useEffect, useState } from 'react'

import slide1 from "../../assets/hero/img1.jpeg";
import slide2 from "../../assets/hero/img2.jpeg";
import slide3 from "../../assets/hero/img3.jpeg";
import slide4 from "../../assets/hero/img4.jpeg";
import slide5 from "../../assets/hero/img5.jpeg";
import slide6 from "../../assets/hero/img6.jpeg";




export default function Hero() {
  //image
  const images = [slide1, slide2, slide3, slide4, slide5, slide6]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (id) => {
    const section = document.getElementById(id)

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <section
      className="relative min-h-[700px] w-full overflow-hidden"
      id="home"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">

        <AnimatePresence initial={false}>
          <motion.img
            key={current}
            src={images[current]}
            alt=""
            className="h-full w-full object-cover rounded-2xl"
            initial={{
              opacity: 0,
              scale: 1,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1,
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/55" />

      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-eyebrow inline-block text-sky-400"
          >
            We Make Your Vents Tidy
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-4xl font-bold leading-[1.1] text-ice sm:text-5xl lg:text-6xl"
          >
            Ventidy
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-sky-400 bg-clip-text text-transparent">
              Solutions.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-lg text-4xl font-bold text-white"
          >We Make Your Vents Tidy
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-row flex-wrap gap-3 sm:gap-4"
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="btn-primary"
            >
              <FileEdit size={18} />
              <span>Get In Touch</span>
            </button>

            <Link
              to="/"
              className="btn-secondary !border-white/30 !text-white hover:!bg-white/10"
            >
              <Search size={18} />
              <span>Company Profile</span>
            </Link>
          </motion.div>
        </div>


      </div>
    </section>
  )
}
