 import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import logo from '../../assets/hero/logo.png'

const FAQS = [
  {
    q: 'How do I register a complaint?',
    a: 'Go to the Complaint Registration page, fill in your details and complaint description, and submit. You will receive a unique complaint ID to track progress.',
  },
  {
    q: 'How can I check the status of my complaint?',
    a: 'Visit the Track Complaint page and enter your complaint ID or the phone number you registered with. You will see the current status, assigned officer, and expected resolution date.',
  },
  {
    q: 'What happens after I submit a complaint?',
    a: 'Your complaint is automatically routed to the relevant department based on category and priority, and an officer is assigned within minutes.',
  },
  {
    q: 'Is my information kept private?',
    a: 'Yes. Your personal details are only visible to the assigned officer and administrators handling your case.',
  },
  {
    q: 'Can I update or add information to an existing complaint?',
    a: 'Yes, contact our support team with your complaint ID and the officer assigned to your case will update the record.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
<section className="py-20 bg-gray-50" id="info">
  <div className="mx-auto max-w-6xl px-6">

    <div className="grid gap-10 md:grid-cols-2">

      {/* Left Rectangle */}
      <div className="rounded-xl border border-gray-300 bg-white p-10 shadow-sm">
        <h2 className="mb-8 text-center text-3xl font-serif">
<div className="mb-8 flex justify-center">
  <img
    src={logo}
    alt="Ventidy Logo"
    className="h-16 w-auto"
  />
</div>
        </h2>

        <p className="text-center leading-8 text-gray-700">
          No:4B Erikkarai street,<br />
          Ramamurthi nagar main road,<br />
          Madipakkam, Chennai 600091
        </p>

        <p className="mt-8 text-center text-lg text-sky-600">
         +91 9940110079
        </p>
      </div>

      {/* Right Rectangle */}
      <div className="rounded-xl border border-gray-300 bg-white p-10 shadow-sm">
        <h2 className="mb-8 text-center text-3xl font-serif">
          Hours
        </h2>

<div className="space-y-2 text-sm">
  {[
    ["Mon", "09:00 AM – 05:00 PM"],
    ["Tue", "09:00 AM – 05:00 PM"],
    ["Wed", "09:00 AM – 05:00 PM"],
    ["Thu", "09:00 AM – 05:00 PM"],
    ["Fri", "09:00 AM – 05:00 PM"],
    ["Sat", "Closed"],
    ["Sun", "Closed"],
  ].map(([day, time]) => (
    <div
      key={day}
      className="flex items-center justify-between border-b border-gray-100 py-2 last:border-none"
    >
      <span className="font-medium text-gray-700">{day}</span>
      <span className="text-gray-500">{time}</span>
    </div>
  ))}
</div>
      </div>

    </div>

  </div>
</section>
  )
}
