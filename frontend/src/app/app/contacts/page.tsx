'use client'

import { useState } from 'react'
import Link from 'next/link'
import WarmthChip from '@/components/ui/WarmthChip'
import { formatDistanceToNow } from 'date-fns'

const DEMO_CONTACTS = [
  {
    id: 'c1',
    name: 'Arjun Malhotra',
    email: 'arjun@kirahealth.in',
    company: 'Kira Health',
    role: 'CEO',
    warmth: 'Hot',
    silence_days: 3,
    deal_count: 1,
    last_activity: new Date(Date.now() - 3 * 86400000).toISOString(),
    stage: 'Proposal Out',
  },
  {
    id: 'c2',
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@groww.in',
    company: 'Groww',
    role: 'VP Engineering',
    warmth: 'Warm',
    silence_days: 7,
    deal_count: 1,
    last_activity: new Date(Date.now() - 7 * 86400000).toISOString(),
    stage: 'In Conversation',
  },
  {
    id: 'c3',
    name: 'Vikram Nair',
    email: 'vikram@razorpay.com',
    company: 'Razorpay',
    role: 'Head of Partnerships',
    warmth: 'Warm',
    silence_days: 5,
    deal_count: 1,
    last_activity: new Date(Date.now() - 5 * 86400000).toISOString(),
    stage: 'Qualified',
  },
  {
    id: 'c4',
    name: 'Priya Sharma',
    email: 'priya.sharma@meesho.com',
    company: 'Meesho',
    role: 'CTO',
    warmth: 'Hot',
    silence_days: 1,
    deal_count: 1,
    last_activity: new Date(Date.now() - 86400000).toISOString(),
    stage: 'Closing',
  },
  {
    id: 'c5',
    name: 'Rohan Verma',
    email: 'rohan.verma@swiggy.in',
    company: 'Swiggy',
    role: 'Head of Product',
    warmth: 'Warm',
    silence_days: 2,
    deal_count: 1,
    last_activity: new Date(Date.now() - 2 * 86400000).toISOString(),
    stage: 'On Radar',
  },
  {
    id: 'c6',
    name: 'Neha Joshi',
    email: 'neha@cred.club',
    company: 'CRED',
    role: 'Director of Finance',
    warmth: 'Hot',
    silence_days: 0,
    deal_count: 1,
    last_activity: new Date().toISOString(),
    stage: 'In Conversation',
  },
  {
    id: 'c7',
    name: 'Amit Patel',
    email: 'amit.patel@pharmeasy.in',
    company: 'PharmEasy',
    role: 'COO',
    warmth: 'Cooling',
    silence_days: 18,
    deal_count: 1,
    last_activity: new Date(Date.now() - 18 * 86400000).toISOString(),
    stage: 'Proposal Out',
  },
]

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const filtered = DEMO_CONTACTS.filter((c) => {
    const matchSearch =
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.warmth === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Contacts</h2>
          <p className="text-sm text-gray-400 mt-0.5">{DEMO_CONTACTS.length} contacts tracked</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors min-h-[44px]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Contact
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-0 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition min-h-[44px]"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'Hot', 'Warm', 'Cooling', 'Cold'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors min-h-[44px] ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Contact list */}
      <div className="space-y-2">
        {filtered.map((contact) => (
          <Link
            key={contact.id}
            href={`/app/contacts/${contact.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            {/* Avatar */}
            <div className="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-semibold">{contact.name.charAt(0)}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-primary text-sm group-hover:text-accent transition-colors">
                  {contact.name}
                </span>
                <span className="text-xs text-gray-400">{contact.role}</span>
              </div>
              <p className="text-xs text-gray-400 truncate">{contact.company} · {contact.email}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{contact.stage}</span>
                <span className="text-xs text-gray-400">
                  {contact.silence_days === 0
                    ? 'Active today'
                    : `${contact.silence_days}d ago`}
                </span>
              </div>
            </div>

            {/* Warmth */}
            <div className="flex-shrink-0">
              <WarmthChip warmth={contact.warmth} />
            </div>

            {/* Arrow */}
            <svg className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No contacts match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
