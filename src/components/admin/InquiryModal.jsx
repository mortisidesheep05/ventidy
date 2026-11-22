import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Copy,
  ExternalLink,
  Tag,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function InquiryModal({
  inquiry,
  isOpen,
  onClose,
  onToggleStatus,
  onDelete,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !inquiry) return null

  const isNew = inquiry.status === 'New'

  const handleCopyMessage = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(inquiry.message)
      toast.success('Inquiry message copied to clipboard!')
    }
  }

  const handleReplyEmail = () => {
    const subject = encodeURIComponent(
      `Re: Ventidy Inquiry - ${inquiry.subject || inquiry.service || 'General Inquiry'}`
    )

    const body = encodeURIComponent(
      `Hello ${inquiry.name},\n\nThank you for reaching out to Ventidy Solutions regarding ${inquiry.service || 'your inquiry'}.\n\nBest regards,\nVentidy Solutions Team`
    )

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inquiry.email)}&su=${subject}&body=${body}`

    window.open(gmailURL, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-navy-100/80 dark:border-white/10 bg-white dark:bg-navy-900 shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-navy-100 dark:border-white/10 px-6 py-5 bg-navy-50/50 dark:bg-navy-950/40">
            <div className="space-y-1">
              <div className="flex items-center gap-3">

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${isNew
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isNew ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'
                      }`}
                  />
                  {inquiry.status} Inquiry
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900 dark:text-ice pt-1">
                {inquiry.name}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-navy-400 hover:text-navy-700 hover:bg-navy-100/60 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50/70 dark:bg-white/5 border border-navy-100/60 dark:border-white/5">
                <div className="h-9 w-9 rounded-lg bg-brand-500/10 text-brand-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-navy-400 dark:text-white/40 uppercase tracking-wider">
                    Email Address
                  </p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-xs sm:text-sm font-medium text-navy-900 dark:text-ice hover:text-brand-600 dark:hover:text-sky-400 truncate block transition-colors"
                  >
                    {inquiry.email}
                  </a>
                </div>
              </div>

              {inquiry.phone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50/70 dark:bg-white/5 border border-navy-100/60 dark:border-white/5">
                  <div className="h-9 w-9 rounded-lg bg-sky-400/10 text-sky-500 flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-navy-400 dark:text-white/40 uppercase tracking-wider">
                      Phone Number
                    </p>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="text-xs sm:text-sm font-medium text-navy-900 dark:text-ice hover:text-brand-600 dark:hover:text-sky-400 truncate block transition-colors"
                    >
                      {inquiry.phone}
                    </a>
                  </div>
                </div>
              )}

              {inquiry.company && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50/70 dark:bg-white/5 border border-navy-100/60 dark:border-white/5">
                  <div className="h-9 w-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Building size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-navy-400 dark:text-white/40 uppercase tracking-wider">
                      Organization
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-navy-900 dark:text-ice truncate">
                      {inquiry.company}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50/70 dark:bg-white/5 border border-navy-100/60 dark:border-white/5">
                <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-navy-400 dark:text-white/40 uppercase tracking-wider">
                    Received Date
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-navy-900 dark:text-ice flex items-center gap-1.5">
                    {inquiry.date}
                    {inquiry.time && (
                      <span className="text-xs text-navy-400 dark:text-white/40">
                        • {inquiry.time}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Service & Subject banner */}
            <div className="p-4 rounded-xl border border-navy-100 dark:border-white/10 bg-navy-50/40 dark:bg-navy-950/30">
              <div className="flex items-center gap-2 mb-1.5">
                <Tag size={14} className="text-brand-500" />
                <span className="text-xs font-semibold text-brand-600 dark:text-sky-400 uppercase tracking-wider">
                  {inquiry.service || 'General Inquiry'}
                </span>
              </div>
              <p className="font-display font-semibold text-sm sm:text-base text-navy-900 dark:text-ice">
                {inquiry.subject || 'Inquiry Details'}
              </p>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-navy-500 dark:text-white/60 uppercase tracking-wider">
                  Full Customer Message
                </label>
                <button
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-sky-400 hover:underline"
                >
                  <Copy size={12} />
                  Copy Text
                </button>
              </div>
              <div className="p-4 rounded-xl bg-navy-50/60 dark:bg-navy-950/60 border border-navy-100 dark:border-white/10 text-sm text-navy-800 dark:text-white/90 leading-relaxed font-body whitespace-pre-wrap select-text">
                {inquiry.message}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-navy-100 dark:border-white/10 px-6 py-4 bg-navy-50/30 dark:bg-navy-950/20">
            <button
              onClick={() => {
                onDelete(inquiry.id)
                onClose()
              }}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 transition-colors"
            >
              <Trash2 size={15} />
              Delete Inquiry
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => onToggleStatus(inquiry.id)}
                className={`inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${isNew
                  ? 'border-teal-500/40 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30'
                  : 'border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                  }`}
              >
                {isNew ? (
                  <>
                    <CheckCircle2 size={15} />
                    Mark as Read
                  </>
                ) : (
                  <>
                    <AlertCircle size={15} />
                    Mark as New
                  </>
                )}
              </button>

              <button
                onClick={handleReplyEmail}
                className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-500 to-sky-400 text-white shadow-glow hover:brightness-110 active:scale-95 transition-all"
              >
                <Mail size={15} />
                Quick Reply
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
