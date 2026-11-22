
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  X,
  User,
  Mail,
  MessageSquare,
} from 'lucide-react'

import { db } from '../../firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { toast } from 'react-toastify'

export default function CTABanner() {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
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
  }, [open])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Submit inquiry to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error('Please fill in all fields.')
      return
    }

    setLoading(true)

    try {
      // If Firestore is blocked (ad-blocker, offline, bad rules) addDoc can hang
      // forever, so give up after 15s and show an error instead.
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 15000)
      )

      await Promise.race([
        addDoc(collection(db, 'consultation_inquiries'), {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          status: 'New',
          createdAt: serverTimestamp(),
        }),
        timeout,
      ])

      setFormData({ fullName: '', email: '', message: '' })
      setOpen(false)
      toast.success('Your inquiry has been submitted successfully!', {
        toastId: 'inquiry-result',
      })
    } catch (error) {
      console.error('Inquiry submission error:', error?.code, error)
      const msg =
        error?.code === 'permission-denied'
          ? 'Submission blocked by server permissions. Please contact us directly.'
          : error?.message === 'timeout'
          ? 'Request timed out. Check your connection or disable ad-blockers and try again.'
          : 'Failed to submit inquiry. Please try again.'
      toast.error(msg, { toastId: 'inquiry-result' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="mx-auto max-w-7xl px-5 pt-20 pb-24 lg:px-8"
      id="contact"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#071426] via-[#0B2748] to-[#124E78] px-8 py-20 text-center shadow-[0_40px_100px_rgba(2,12,27,.45)]"
      >
        {/* Ambient Lights */}
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />

        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[140px]" />

        {/* Premium Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Get in Touch
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Have a question or need a customized cleaning solution?
            <br />
            Our specialists are ready to help you find the perfect solution.
          </p>

          <button
            onClick={() => setOpen(true)}
            className="group relative mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white px-8 py-4 font-semibold text-slate-900 shadow-[0_15px_40px_rgba(255,255,255,.15)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_25px_55px_rgba(255,255,255,.25)]"
          >
            Get Started

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cta-modal fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/70 p-5 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="cta-modal-panel relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[30px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_40px_90px_rgba(15,23,42,.18)] sm:p-10"
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-6 top-6 rounded-full p-2 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Request a Consultation
              </h2>

              <p className="mt-3 text-slate-500">
                Tell us about your requirements and one of our specialists will
                get back to you shortly.
              </p>

              {/* Consultation Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">

                {/* Full Name */}
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full rounded-2xl border border-slate-200 py-3.5 pl-12 pr-4 outline-none transition-all duration-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full rounded-2xl border border-slate-200 py-3.5 pl-12 pr-4 outline-none transition-all duration-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                {/* Requirements */}
                <div className="relative">
                  <MessageSquare
                    size={18}
                    className="absolute left-4 top-5 text-slate-400"
                  />

                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    required
                    className="w-full resize-none rounded-2xl border border-slate-200 py-3.5 pl-12 pr-4 outline-none transition-all duration-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                    className="rounded-2xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B2748] to-[#124E78] px-7 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Sending...' : 'Send Inquiry'}

                    {!loading && (
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    )}
                  </button>

                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
