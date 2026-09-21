import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { Search, Loader2, User, Calendar, Clock } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import ResolutionRing from '../components/ui/ResolutionRing'
import complaintService from '../services/complaintService'
import { STATUS_STYLES, STATUS_PROGRESS, formatDate } from '../utils/helpers'

export default function ComplaintTracking() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const onSubmit = async (values) => {
    setNotFound(false)
    try {
      const data = await complaintService.track(values)
      setResult(data)
    } catch (err) {
      setResult(null)
      if (err?.response?.status === 404) {
        setNotFound(true)
      } else {
        toast.error(err?.response?.data?.message || 'Could not fetch complaint status. Please try again.')
      }
    }
  }

  const progress = result ? STATUS_PROGRESS[result.status] ?? 10 : 0

  return (
    <>
      <PageHero
        eyebrow="Check progress"
        title="Track Your Complaint"
        description="Enter your complaint ID or the phone number used at registration to see live status."
      />

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="card grid grid-cols-1 gap-5 p-7 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">Complaint ID</label>
            <input className="input-field font-mono" placeholder="VTD-00012345" {...register('complaintId')} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">Or Phone Number</label>
            <input className="input-field" placeholder="+91 98765 43210" {...register('phone')} />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto !py-3">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              Track
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mt-6 p-6 text-center text-navy-500 dark:text-white/50"
            >
              We couldn't find a complaint matching those details. Double-check your complaint ID or phone number.
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mt-6 p-8"
            >
              <div className="flex flex-col items-center gap-8 sm:flex-row">
                <ResolutionRing progress={progress} size={130} label={`${progress}%`} sublabel={result.status} />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm text-navy-400 dark:text-white/40">{result.id || result.complaintId}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[result.status] || 'bg-navy-100 text-navy-600'}`}>
                      {result.status}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy-900 dark:text-ice">
                    {result.category || result.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <InfoItem icon={User} label="Assigned Officer" value={result.assignedOfficer || 'Unassigned'} />
                    <InfoItem icon={Calendar} label="Created" value={formatDate(result.createdAt)} />
                    <InfoItem icon={Clock} label="Expected Resolution" value={formatDate(result.expectedResolution)} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-brand-50/70 px-4 py-3 dark:bg-white/5">
      <p className="flex items-center gap-1.5 text-xs text-navy-400 dark:text-white/40">
        <Icon size={13} /> {label}
      </p>
      <p className="mt-1 text-sm font-medium text-navy-800 dark:text-white/80">{value}</p>
    </div>
  )
}
