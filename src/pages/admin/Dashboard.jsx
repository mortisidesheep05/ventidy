import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Inbox,
  Clock,
  CheckCircle2,
  Search,
  Eye,
  Trash2,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { db } from '../../firebase'
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

import StatCard from '../../components/dashboard/StatCard'
import InquiryModal from '../../components/admin/InquiryModal'

export default function Dashboard() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch live inquiries from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'consultation_inquiries'),
      (snapshot) => {
        const fetchedInquiries = snapshot.docs.map((document) => {
          const data = document.data()

          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : null

          return {
            id: document.id,
            name: data.fullName || 'Unknown',
            email: data.email || '',
            message: data.message || '',
            status: data.status || 'New',
            date: createdAt
              ? createdAt.toLocaleDateString('en-IN')
              : 'Pending',
            time: createdAt
              ? createdAt.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })
              : '',
          }
        })

        setInquiries(fetchedInquiries)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching inquiries:', error)
        toast.error('Unable to load inquiries.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = inquiries.length
    const newCount = inquiries.filter((i) => i.status === 'New').length
    const readCount = inquiries.filter((i) => i.status === 'Read').length

    return { total, newCount, readCount }
  }, [inquiries])

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()

        return (
          item.name?.toLowerCase().includes(query) ||
          item.email?.toLowerCase().includes(query) ||
          item.message?.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [inquiries, statusFilter, searchQuery])

  // Open inquiry details
  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry)
    setIsModalOpen(true)
  }

  // Update inquiry status in Firebase
  const handleToggleStatus = async (id) => {
    const inquiry = inquiries.find((item) => item.id === id)

    if (!inquiry) return

    const nextStatus = inquiry.status === 'New' ? 'Read' : 'New'

    try {
      await updateDoc(doc(db, 'consultation_inquiries', id), {
        status: nextStatus,
      })

      toast.success(`Inquiry marked as ${nextStatus}!`)
    } catch (error) {
      console.error('Status update error:', error)
      toast.error('Failed to update inquiry status.')
    }
  }

  // Delete inquiry from Firebase
  const handleDelete = async (id) => {
    const target = inquiries.find((item) => item.id === id)

    try {
      await deleteDoc(doc(db, 'consultation_inquiries', id))

      toast.success(`Deleted inquiry from ${target?.name || 'customer'}.`)

      if (selectedInquiry?.id === id) {
        setIsModalOpen(false)
        setSelectedInquiry(null)
      }
    } catch (error) {
      console.error('Delete inquiry error:', error)
      toast.error('Failed to delete inquiry.')
    }
  }

  return (
    <div className="space-y-8 font-body">

      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2">
          <span className="section-eyebrow">Ventidy Administration</span>


        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 dark:text-ice mt-1">
          Dashboard
        </h1>


      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div
          onClick={() => setStatusFilter('All')}
          className={`cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 ${statusFilter === 'All' ? 'ring-2 ring-brand-500 rounded-2xl' : ''
            }`}
        >
          <StatCard
            icon={Inbox}
            label="Total Inquiries"
            value={stats.total}
            tone="brand"
            delta={`${stats.total} Total`}
          />
        </div>

        <div
          onClick={() => setStatusFilter('New')}
          className={`cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 ${statusFilter === 'New' ? 'ring-2 ring-amber-500 rounded-2xl' : ''
            }`}
        >
          <StatCard
            icon={Clock}
            label="New Inquiries"
            value={stats.newCount}
            tone="amber"
            delta={stats.newCount > 0 ? `${stats.newCount} Require Attention` : 'All Caught Up'}
          />
        </div>

        <div
          onClick={() => setStatusFilter('Read')}
          className={`cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 ${statusFilter === 'Read' ? 'ring-2 ring-teal-500 rounded-2xl' : ''
            }`}
        >
          <StatCard
            icon={CheckCircle2}
            label="Read Inquiries"
            value={stats.readCount}
            tone="teal"
            delta="Reviewed"
          />
        </div>

      </div>

      {/* Main Table */}
      <div className="card overflow-hidden border border-navy-100/80 dark:border-white/10 bg-white/90 dark:bg-navy-900/90 shadow-soft">

        {/* Search and Filters */}
        <div className="p-5 sm:p-6 border-b border-navy-100 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-50/80 dark:bg-white/5 border border-navy-100/60 dark:border-white/10 w-fit">

            {[
              { key: 'All', label: 'All Inquiries', count: stats.total },
              { key: 'New', label: 'New', count: stats.newCount },
              { key: 'Read', label: 'Read', count: stats.readCount },
            ].map((tab) => {
              const active = statusFilter === tab.key

              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${active
                    ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-sky-400 shadow-sm border border-brand-500/20'
                    : 'text-navy-500 dark:text-white/50 hover:text-navy-900 dark:hover:text-white'
                    }`}
                >
                  <span>{tab.label}</span>

                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${active
                    ? 'bg-brand-500/10 text-brand-600 dark:text-sky-400'
                    : 'bg-navy-100 dark:bg-white/10 text-navy-400 dark:text-white/40'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}

          </div>

          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400 dark:text-white/40">
              <Search size={16} />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, keyword..."
              className="input-field !pl-10 !py-2.5 text-xs sm:text-sm"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-navy-400 hover:text-navy-700 dark:text-white/40 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-12 text-center text-sm text-navy-400">
            Loading inquiries from Firebase...
          </div>
        ) : (
          <>
            {/* Inquiries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">

                <thead>
                  <tr className="border-b border-navy-100 dark:border-white/10 bg-navy-50/40 dark:bg-navy-950/40 text-[11px] uppercase tracking-wider text-navy-400 dark:text-white/40 font-semibold">
                    <th className="px-6 py-3.5">Customer Name</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Message</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-navy-50 dark:divide-white/5">

                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inquiry) => {
                      const isNew = inquiry.status === 'New'

                      return (
                        <tr
                          key={inquiry.id}
                          onClick={() => handleViewInquiry(inquiry)}
                          className="group cursor-pointer hover:bg-brand-50/40 dark:hover:bg-white/[0.03] transition-colors"
                        >

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-sky-400 text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-sm">
                                {inquiry.name
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-navy-900 dark:text-ice text-sm group-hover:text-brand-600 dark:group-hover:text-sky-400 transition-colors">
                                  {inquiry.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-xs font-mono text-navy-600 dark:text-white/70">
                            <span className="truncate block max-w-[180px]" title={inquiry.email}>
                              {inquiry.email}
                            </span>
                          </td>

                          <td className="px-4 py-4 max-w-xs md:max-w-md">
                            <p className="text-xs text-navy-700 dark:text-white/80 line-clamp-2">
                              {inquiry.message}
                            </p>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-xs text-navy-500 dark:text-white/50">
                            <div>{inquiry.date}</div>
                            {inquiry.time && (
                              <div className="text-[10px] text-navy-400 dark:text-white/30">
                                {inquiry.time}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleStatus(inquiry.id)
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-transform active:scale-95 ${isNew
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                                : 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30 hover:bg-teal-500/25'
                                }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${isNew ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'
                                }`} />
                              {inquiry.status}
                            </button>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div
                              className="flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >


                              <button
                                type="button"
                                onClick={() => handleDelete(inquiry.id)}
                                className="p-1.5 rounded-lg text-navy-400 hover:text-red-600 hover:bg-red-500/10 dark:text-white/40 dark:hover:text-red-400 dark:hover:bg-white/10 transition-colors"
                                title="Delete inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>

                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="mx-auto max-w-sm space-y-3">
                          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-navy-100 dark:bg-white/5 text-navy-400 dark:text-white/40">
                            <Search size={22} />
                          </div>

                          <p className="font-semibold text-navy-800 dark:text-white">
                            No inquiries match your criteria
                          </p>

                          <p className="text-xs text-navy-400 dark:text-white/40">
                            Try modifying your search keywords or resetting the status filters.
                          </p>

                          {(searchQuery || statusFilter !== 'All') && (
                            <button
                              onClick={() => {
                                setSearchQuery('')
                                setStatusFilter('All')
                              }}
                              className="btn-secondary !py-2 !px-4 !text-xs mt-2"
                            >
                              Clear All Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-navy-100 dark:border-white/10 bg-navy-50/30 dark:bg-navy-950/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-400 dark:text-white/40">
              <div>
                Showing <span className="font-semibold text-navy-700 dark:text-white/70">{filteredInquiries.length}</span> of{' '}
                <span className="font-semibold text-navy-700 dark:text-white/70">{inquiries.length}</span> inquiries
              </div>


            </div>
          </>
        )}

      </div>

      {/* Inquiry Detail Modal */}
      <InquiryModal
        inquiry={selectedInquiry}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedInquiry(null)
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

    </div>
  )
}