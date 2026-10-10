import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Route, MessageCircleWarning, LineChart, ShieldAlert, HeadphonesIcon } from 'lucide-react'
import img1 from "../../assets/hero/nee_to_add/im1.jpeg";
import img2 from "../../assets/hero/nee_to_add/img2.jpeg";
import img3 from "../../assets/hero/nee_to_add/img3.jpeg";
import img4 from "../../assets/hero/nee_to_add/img4.jpeg";
import img5 from "../../assets/hero/nee_to_add/img5.jpeg";
import img6 from "../../assets/hero/nee_to_add/img6.jpeg";
import img7 from "../../assets/hero/nee_to_add/img7.jpeg";
import img8 from "../../assets/hero/nee_to_add/img8.jpeg";
import img9 from "../../assets/hero/nee_to_add/img9.jpeg";
import img10 from "../../assets/hero/nee_to_add/img10.jpeg";
import img11 from "../../assets/hero/nee_to_add/img11.jpeg";
import img12 from "../../assets/hero/nee_to_add/img12.jpeg";

export const SERVICES = [
  {
    icon: ClipboardList,
    title: 'Complaint Intake',
    desc: 'Guided, validated forms that capture every detail needed to act on a complaint immediately.',
  },
  {
    icon: Route,
    title: 'Smart Routing',
    desc: 'Complaints are automatically routed to the right department or officer based on category.',
  },
  {
    icon: MessageCircleWarning,
    title: 'Live Status Tracking',
    desc: 'Users track resolution progress in real time using their complaint ID or phone number.',
  },
  {
    icon: LineChart,
    title: 'Analytics & Reporting',
    desc: 'Dashboards surface trends, bottlenecks, and officer performance at a glance.',
  },
  {
    icon: ShieldAlert,
    title: 'Priority Escalation',
    desc: 'Urgent complaints are flagged and escalated automatically so nothing critical waits.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    desc: 'Our team helps you configure workflows, categories, and officer assignments.',
  },

]
const SERVICE_IMAGES = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12
]
const CARD_POSITIONS = [
  {
    x: 0,
    y: 0,
    rotate: -6,
    scale: 1,
    zIndex: 3,
  },
  {
    x: 20,
    y: 20,
    rotate: 0,
    scale: 0.96,
    zIndex: 2,
  },
  {
    x: 40,
    y: 40,
    rotate: 6,
    scale: 0.92,
    zIndex: 1,
  },
]
const CARD_VARIANTS = {
  top: {
    x: 0,
    y: 0,
    rotate: -6,
    scale: 1,
  },

  middle: {
    x: 20,
    y: 20,
    rotate: 0,
    scale: 0.96,
  },

  back: {
    x: 40,
    y: 40,
    rotate: 6,
    scale: 0.92,
  },
}

export default function ServicesPreview() {


  // states
  const [images, setImages] = useState(SERVICE_IMAGES)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0)


  useEffect(() => {
    const interval = setInterval(() => {

      setImages((prev) => {
        const arr = [...prev]
        const first = arr.shift()
        arr.push(first)
        return arr
      })

      setActiveIndex((prev) => (prev + 1) % SERVICE_IMAGES.length)

    }, 3000)

    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    const isPopupOpen = showGallery || selectedImage !== null

    if (isPopupOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [showGallery, selectedImage])
  const handleNext = () => {
    const nextIndex = (galleryIndex + 1) % SERVICE_IMAGES.length

    setGalleryIndex(nextIndex)
    setSelectedImage(SERVICE_IMAGES[nextIndex])
  }

  const handlePrevious = () => {
    const previousIndex =
      (galleryIndex - 1 + SERVICE_IMAGES.length) % SERVICE_IMAGES.length

    setGalleryIndex(previousIndex)
    setSelectedImage(SERVICE_IMAGES[previousIndex])
  }


  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8" id="services">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mt-3 text-3xl font-bold text-navy-900 dark:text-ice lg:text-4xl">Gallery</h2>
      </div>

      <div className="mt-14 flex justify-center">
        <div className="gallery-stack relative h-[420px] w-[320px]">

          {images.slice(0, 3).map((img, i) => {

            const variant =
              i === 0
                ? "top"
                : i === 1
                  ? "middle"
                  : "back";

            return (
              <motion.img
                onClick={() => {
                  setGalleryIndex(i)
                  setSelectedImage(img)
                }}
                layout
                key={img}
                src={img}
                alt={`Service ${i + 1}`}

                style={{
                  zIndex: CARD_POSITIONS[i].zIndex,
                }}

                variants={CARD_VARIANTS}
                animate={variant}

                whileHover={{
                  scale: 1.05,
                }}

                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                }}

                className="gallery-card absolute h-[300px] w-[500px] rounded-2xl border-4 border-white object-cover shadow-2xl"
              />
            );
          })}
        </div>

      </div>


      <div className="mt-10 ml-6 flex items-center justify-center gap-3">
        {SERVICE_IMAGES.map((_, i) => (

          <motion.div
            key={i}
            animate={{
              width: activeIndex === i ? 34 : 10,
              opacity: activeIndex === i ? 1 : 0.50,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 22,
            }}
            className={`h-[10px] rounded-full ${activeIndex === i
                ? "bg-brand-600"
                : "bg-brand-600"
              }`}
          />
        ))}

      </div>

      {/* show gallery */}

      <AnimatePresence>
        {showGallery && (
          <motion.div
            className="gallery-modal fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl p-8">
              {SERVICE_IMAGES.map((image, index) => (
                <motion.img
                  key={index}
                  src={image}
                  onClick={() => {
                    setGalleryIndex(index)
                    setSelectedImage(image)
                  }}
                />
              ))}
              <button
                onClick={() => setShowGallery(false)}
                className="absolute right-8 top-8 text-5xl text-white"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="gallery-lightbox fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="gallery-close absolute top-8 right-8 z-50 text-5xl text-white"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </motion.button>


            {/* Previous button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="gallery-prev absolute left-6 top-1/2 z-50 -translate-y-1/2 text-5xl text-white"
              onClick={handlePrevious}
            >
              ‹
            </motion.button>


            {/* Selected image */}
            <motion.img
              src={selectedImage}
              className="gallery-image max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
            />


            {/* Next button */}
            <motion.button
              whileHover={{ opacity: 0.7 }}
              whileTap={{ opacity: 0.5 }}
              className="gallery-next absolute right-6 top-1/2 z-50 -translate-y-1/2 text-5xl text-white"
              onClick={handleNext}
            >
              ›
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
