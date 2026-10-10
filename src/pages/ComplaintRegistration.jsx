import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { CheckCircle2, UploadCloud, Loader2 } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import complaintService from '../services/complaintService'
import { CATEGORIES, PRIORITIES } from '../utils/helpers'

export default function ComplaintRegistration() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' })

  const [submitted, setSubmitted] = useState(null)
  const [preview, setPreview] = useState(null)
  const imageFile = watch('image')

  const onImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values) => {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (key === 'image') {
          if (val?.[0]) formData.append('image', val[0])
        } else {
          formData.append(key, val)
        }
      })
      const result = await complaintService.create(formData)
      setSubmitted(result?.complaintId || result?.id || 'VTD-' + Date.now().toString().slice(-8))
      reset()
      setPreview(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not submit your complaint. Please try again.')
    }
  }

  return (
    <>
      <PageHero
        eyebrow="File an issue"
        title="Register a Complaint"
        description="Tell us what happened. We'll route it to the right team and give you an ID to track progress."
      />

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card flex flex-col items-center p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              >
                <CheckCircle2 className="text-teal-500" size={64} />
              </motion.div>
              <h2 className="mt-5 font-display text-2xl font-bold text-navy-900 dark:text-ice">
                Complaint submitted
              </h2>
              <p className="mt-2 text-navy-500 dark:text-white/50">
                Your complaint has been registered successfully. Save this ID to track progress:
              </p>
              <p className="mt-4 rounded-xl bg-brand-50 px-6 py-3 font-mono text-lg font-semibold text-brand-700 dark:bg-white/5 dark:text-sky-400">
                {submitted}
              </p>
              <button onClick={() => setSubmitted(null)} className="btn-primary mt-8">
                File another complaint
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="card space-y-6 p-8"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Full Name" error={errors.name?.message}>
                  <input
                    className="input-field"
                    placeholder="Jane Doe"
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })}
                  />
                </Field>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <input
                    className="input-field"
                    placeholder="+91 98765 43210"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^[+\d][\d\s-]{7,15}$/, message: 'Enter a valid phone number' },
                    })}
                  />
                </Field>
              </div>

              <Field label="Email Address" error={errors.email?.message}>
                <input
                  type="email"
                  className="input-field"
                  placeholder="jane@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
                  })}
                />
              </Field>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Complaint Category" error={errors.category?.message}>
                  <select className="input-field" defaultValue="" {...register('category', { required: 'Please select a category' })}>
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Priority" error={errors.priority?.message}>
                  <select className="input-field" defaultValue="" {...register('priority', { required: 'Please select a priority' })}>
                    <option value="" disabled>Select priority</option>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Location" error={errors.location?.message}>
                <input
                  className="input-field"
                  placeholder="City, area, or branch"
                  {...register('location', { required: 'Location is required' })}
                />
              </Field>

              <Field label="Complaint Description" error={errors.description?.message}>
                <textarea
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Describe your complaint in detail..."
                  {...register('description', {
                    required: 'Please describe the complaint',
                    minLength: { value: 20, message: 'Please provide at least 20 characters' },
                  })}
                />
              </Field>

              <Field label="Upload Image (optional)" error={errors.image?.message}>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-navy-200 px-6 py-8 text-center hover:border-brand-500 dark:border-white/15">
                  <UploadCloud className="text-brand-500 dark:text-sky-400" size={28} />
                  <span className="mt-2 text-sm text-navy-500 dark:text-white/50">
                    {imageFile?.[0]?.name || 'Click to upload a supporting photo'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" {...register('image')} onChange={onImageChange} />
                </label>
                {preview && (
                  <img src={preview} alt="Preview" className="mt-3 h-32 w-32 rounded-xl object-cover" />
                )}
              </Field>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full !py-3.5">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}
