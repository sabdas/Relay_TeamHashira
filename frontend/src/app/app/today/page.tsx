'use client'

import { useState, useEffect } from 'react'
import WarmthChip from '@/components/ui/WarmthChip'
import InferredBadge from '@/components/ui/InferredBadge'
import LoadingAnimation from '@/components/ui/LoadingAnimation'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

type Tab = 'followups' | 'drafts' | 'upcoming' | 'offtrack'

const DEMO_DATA = {
  followups: [
    {
      id: '1',
      contact_name: 'Arjun Malhotra',
      company: 'Kira Health',
      warmth: 'Hot',
      silence_days: 3,
      last_activity: new Date(Date.now() - 3 * 86400000).toISOString(),
      suggestion: 'Send follow-up on the pilot proposal you sent last Tuesday.',
      thread_count: 12,
      is_inferred: true,
      confidence: 87,
      contact_id: 'c1',
    },
    {
      id: '2',
      contact_name: 'Sneha Kapoor',
      company: 'Groww',
      warmth: 'Warm',
      silence_days: 7,
      last_activity: new Date(Date.now() - 7 * 86400000).toISOString(),
      suggestion: 'Check in on the security review timeline — last meeting was a week ago.',
      thread_count: 6,
      is_inferred: false,
      confidence: 92,
      contact_id: 'c2',
    },
    {
      id: '3',
      contact_name: 'Vikram Nair',
      company: 'Razorpay',
      warmth: 'Warm',
      silence_days: 5,
      last_activity: new Date(Date.now() - 5 * 86400000).toISOString(),
      suggestion: 'Loop in their CTO as discussed — Vikram mentioned this in the last call.',
      thread_count: 9,
      is_inferred: true,
      confidence: 74,
      contact_id: 'c3',
    },
  ],
  drafts: [
    {
      id: 'd1',
      contact_name: 'Priya Sharma',
      company: 'Meesho',
      subject: 'Re: Integration timeline & next steps',
      snippet: 'Hi Priya, following up on our discussion about the Q3 integration...',
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 'd2',
      contact_name: 'Rahul Gupta',
      company: 'Zepto',
      subject: 'Proposal: Enterprise plan for 50-100 users',
      snippet: 'Hi Rahul, as promised here\'s the breakdown of pricing for your team...',
      created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
  ],
  upcoming: [
    {
      id: 'u1',
      title: 'Intro call with Rohan Verma',
      company: 'Swiggy',
      start_time: new Date(Date.now() + 2 * 3600000).toISOString(),
      duration_mins: 30,
      contact_id: 'c4',
      prep_note: 'New inbound — referred by Vikram. First call, discovery focus.',
    },
    {
      id: 'u2',
      title: 'Demo: Neha Joshi & team',
      company: 'CRED',
      start_time: new Date(Date.now() + 5 * 3600000).toISOString(),
      duration_mins: 60,
      contact_id: 'c5',
      prep_note: '3 stakeholders joining. Prepare ROI calculator slide.',
    },
  ],
  offtrack: [
    {
      id: 'o1',
      contact_name: 'Amit Patel',
      company: 'PharmEasy',
      warmth: 'Cooling',
      silence_days: 18,
      last_activity: new Date(Date.now() - 18 * 86400000).toISOString(),
      stage: 'Proposal Out',
      risk: 'No response to proposal sent 18 days ago. Moving to cooling.',
    },
  ],
}

const TABS: { id: Tab; label: string; count: number }[] = [
  { id: 'followups', label: 'Follow-ups', count: DEMO_DATA.followups.length },
  { id: 'drafts', label: 'Drafts', count: DEMO_DATA.drafts.length },
  { id: 'upcoming', label: 'Upcoming', count: DEMO_DATA.upcoming.length },
  { id: 'offtrack', label: 'Off Track', count: DEMO_DATA.offtrack.length },
]

export default function TodayPage() {
  const [activeTab, setActiveTab] = useState<Tab>('followups')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1800)
    return () => clearTimeout(t)
  }, [])

  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-primary">Today</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-2xl p-4 text-left transition-all min-h-[44px] ${
              activeTab === tab.id
                ? 'bg-accent text-white shadow-md'
                : 'bg-white border border-gray-100 text-primary hover:border-accent hover:shadow-sm'
            }`}
          >
            <div className={`text-2xl font-bold ${activeTab === tab.id ? 'text-white' : 'text-primary'}`}>
              {tab.count}
            </div>
            <div className={`text-xs font-medium mt-0.5 ${activeTab === tab.id ? 'text-indigo-200' : 'text-gray-400'}`}>
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'followups' && (
          <div className="space-y-3">
            {DEMO_DATA.followups.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-accent-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-semibold text-sm">{item.contact_name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/app/contacts/${item.contact_id}`}
                        className="font-semibold text-primary text-sm hover:text-accent transition-colors"
                      >
                        {item.contact_name}
                      </Link>
                      <span className="text-xs text-gray-400">{item.company}</span>
                      {item.is_inferred && <InferredBadge confidence={item.confidence} />}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <WarmthChip warmth={item.warmth} />
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(item.last_activity), { addSuffix: true })}
                      </span>
                      <span className="text-xs text-gray-400">· {item.thread_count} threads</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.suggestion}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 px-3 bg-accent text-white rounded-xl text-xs font-medium hover:bg-indigo-700 transition-colors min-h-[36px]">
                    Draft reply
                  </button>
                  <button className="flex-1 py-2 px-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors min-h-[36px]">
                    Snooze 2d
                  </button>
                  <button className="py-2 px-3 border border-gray-200 text-gray-500 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors min-h-[36px]">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="space-y-3">
            {DEMO_DATA.drafts.map((draft) => (
              <div key={draft.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm">{draft.contact_name}</p>
                    <p className="text-xs text-gray-400">{draft.company}</p>
                    <p className="text-xs font-medium text-gray-600 mt-1.5">{draft.subject}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{draft.snippet}</p>
                    <p className="text-xs text-gray-300 mt-1.5">
                      Saved {formatDistanceToNow(new Date(draft.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 px-3 bg-accent text-white rounded-xl text-xs font-medium hover:bg-indigo-700 transition-colors min-h-[36px]">
                    Review & Send
                  </button>
                  <button className="py-2 px-3 border border-gray-200 text-gray-500 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors min-h-[36px]">
                    Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-3">
            {DEMO_DATA.upcoming.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.company}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>·</span>
                      <span>{event.duration_mins}min</span>
                      <span>·</span>
                      <span>
                        in {formatDistanceToNow(new Date(event.start_time))}
                      </span>
                    </div>
                    {event.prep_note && (
                      <div className="mt-2 bg-amber-50 rounded-xl px-3 py-2">
                        <p className="text-xs text-amber-700">
                          <span className="font-medium">Prep: </span>{event.prep_note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'offtrack' && (
          <div className="space-y-3">
            {DEMO_DATA.offtrack.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-primary text-sm">{item.contact_name}</span>
                      <span className="text-xs text-gray-400">{item.company}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <WarmthChip warmth={item.warmth} />
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{item.stage}</span>
                    </div>
                    <p className="text-sm text-red-600 mt-2 leading-relaxed">{item.risk}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 px-3 bg-red-500 text-white rounded-xl text-xs font-medium hover:bg-red-600 transition-colors min-h-[36px]">
                    Re-engage now
                  </button>
                  <button className="py-2 px-3 border border-gray-200 text-gray-500 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors min-h-[36px]">
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
