import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { MessageCircle } from "lucide-react";

const TESTIMONIALS = [
  {
    name: 'Ananya Rao',
    role: 'Operations Head, Metro Utilities',
    quote:
      'We went from a spreadsheet of complaints nobody owned to a system where every issue has a name attached to it. Resolution time dropped by half.',
  },
  {
    name: 'David Okafor',
    role: 'Customer Success Lead, Bridgeway Retail',
    quote:
      'Our customers can finally check status themselves instead of calling us. The tracking page alone cut our support calls significantly.',
  },
  {
    name: 'Priya Menon',
    role: 'City Grievance Officer',
    quote:
      'The priority escalation feature means urgent complaints never sit in a queue. It changed how our whole department works.',
  },
]

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8" >
<div className="mx-auto max-w-2xl rounded-3xl border border-white/30 bg-white/80 p-8 text-center backdrop-blur-md shadow-2xl">
        
        <h2 className="mt-3 text-3xl font-bold text-navy-900 dark:text-ice lg:text-4xl mb-4">Your Visit Is Always Welcome.</h2>
        <span className="section-eyebrow text-base">Stop by during business hours to discuss your needs with our friendly team.</span><br></br>
<div className="mt-8 flex justify-center ">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex w-72 items-center justify-center gap-3 rounded-xl bg-green-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-green-600"
  >
    <MessageCircle size={24} />
    WhatsApp
  </motion.button>
</div>
      </div>


    </section>
  )
}
