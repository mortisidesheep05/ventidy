import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { Loader2, Mail, Phone, MapPin, Clock } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import apiClient from '../services/apiClient'

const CONTACT_INFO = [
  { icon: MapPin, label: 'Office', value: 'No:4B,Erikkarai street,Ramamurthi nagar main road,Madipakkam, chennai 600091' },
  { icon: Phone, label: 'Phone', value: '+91 9940110079' },
  { icon: Mail, label: 'Email', value: 'Contact@ventidy.com' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 9:00 AM – 7:00 PM IST' },
]

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (values) => {
    try {
      await apiClient.post('/contact', values)
      toast.success('Message sent — our team will get back to you shortly.')
      reset()
    } catch {
      toast.error('Could not send your message right now. Please try again.')
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        description="Questions about Ventidy, partnerships, or your account? We're here to help."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {CONTACT_INFO.map((c) => (
              <div key={c.label} className="card flex items-start gap-4 p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-400 text-white">
                  <c.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-navy-400 dark:text-white/40">{c.label}</p>
                  <p className="mt-0.5 font-medium text-navy-800 dark:text-white/80">{c.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit(onSubmit)}
            className="card space-y-5 p-8 lg:col-span-3"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">Name</label>
                <input className="input-field" placeholder="Your name" {...register('name', { required: 'Name is required' })} />
                {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
                />
                {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">Subject</label>
              <input className="input-field" placeholder="How can we help?" {...register('subject', { required: 'Subject is required' })} />
              {errors.subject && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">Message</label>
              <textarea
                rows={5}
                className="input-field resize-none"
                placeholder="Tell us more..."
                {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message is too short' } })}
              />
              {errors.message && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full !py-3.5">
              {isSubmitting && <Loader2 className="animate-spin" size={18} />}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </section>
    </>
  )
}
