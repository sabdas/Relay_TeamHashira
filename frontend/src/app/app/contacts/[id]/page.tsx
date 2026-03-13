'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import WarmthChip from '@/components/ui/WarmthChip'
import InferredBadge from '@/components/ui/InferredBadge'
import { formatDistanceToNow, format } from 'date-fns'

const CONTACTS_DATA: Record<string, {
  id: string
  name: string
  email: string
  company: string
  role: string
  warmth: string
  silence_days: number
  stage: string
  timeline: Array<{
    id: string
    type: 'email' | 'meeting' | 'note' | 'stage_change'
    title: string
    description: string
    timestamp: string
    is_inferred?: boolean
    confidence?: number
    source?: string
  }>
}> = {
  c1: {
    id: 'c1',
    name: 'Arjun Malhotra',
    email: 'arjun@kirahealth.in',
    company: 'Kira Health',
    role: 'CEO',
    warmth: 'Hot',
    silence_days: 3,
    stage: 'Proposal Out',
    timeline: [
      {
        id: 't1',
        type: 'email',
        title: 'Re: Pilot proposal — next steps',
        description: 'Subject: Re: Pilot proposal. Thread with 4 replies over 2 days.',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
        source: 'gmail',
      },
      {
        id: 't2',
        type: 'meeting',
        title: 'Product demo (45 min)',
        description: '2 participants. Arjun + 1 from Kira Health team.',
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
        is_inferred: true,
        confidence: 91,
        source: 'calendar',
      },
      {
        id: 't3',
        type: 'stage_change',
        title: 'Moved to Proposal Out',
        description: 'Stage advanced from Qualified based on demo completion signal.',
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
        is_inferred: true,
        confidence: 89,
      },
      {
        id: 't4',
        type: 'email',
        title: 'Intro + context email',
        description: 'First contact. Inbound via Y Combinator community.',
        timestamp: new Date(Date.now() - 21 * 86400000).toISOString(),
        source: 'gmail',
      },
    ],
  },
  c2: {
    id: 'c2',
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@groww.in',
    company: 'Groww',
    role: 'VP Engineering',
    warmth: 'Warm',
    silence_days: 7,
    stage: 'In Conversation',
    timeline: [
      {
        id: 't1',
        type: 'email',
        title: 'Security questionnaire response',
        description: 'Replied to 8 security questions. Mentioned 2-week legal review.',
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
        source: 'gmail',
      },
      {
        id: 't2',
        type: 'meeting',
        title: 'Technical deep-dive (60 min)',
        description: '3 participants from Groww engineering team.',
        timestamp: new Date(Date.now() - 14 * 86400000).toISOString(),
        is_inferred: true,
        confidence: 85,
        source: 'calendar',
      },
    ],
  },
}

const TYPE_ICONS: Record<string, { icon: string; bg: string; text: string }> = {
  email: { icon: '📧', bg: 'bg-blue-50', text: 'text-blue-600' },
  meeting: { icon: '📅', bg: 'bg-green-50', text: 'text-green-600' },
  note: { icon: '📝', bg: 'bg-amber-50', text: 'text-amber-600' },
  stage_change: { icon: '→', bg: 'bg-indigo-50', text: 'text-indigo-600' },
}

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const contact = CONTACTS_DATA[id] || {
    id,
    name: 'Unknown Contact',
    email: 'unknown@example.com',
    company: 'Unknown',
    role: 'Unknown',
    warmth: 'Cold',
    silence_days: 0,
    stage: 'On Radar',
    timeline: [],
  }

  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isQuerying, setIsQuerying] = useState(false)

  const handleQuery = async () => {
    if (!query.trim()) return
    setIsQuerying(true)
    await new Promise((r) => setTimeout(r, 1400))
    setAiResponse(
      `Based on ${contact.timeline.length} signals for ${contact.name} at ${contact.company}:\n\n` +
      `Current stage is **${contact.stage}** with a warmth score of **${contact.warmth}**. ` +
      `Last activity was ${contact.silence_days} days ago. ` +
      `The most recent signal was an email thread about next steps. ` +
      `Recommended action: follow up with a concise check-in referencing the last meeting agenda.`
    )
    setIsQuerying(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors min-h-[44px]"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Contacts
      </button>

      {/* Contact header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-accent-light rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-accent font-bold text-xl">{contact.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-primary">{contact.name}</h2>
            <p className="text-sm text-gray-500">{contact.role} at {contact.company}</p>
            <p className="text-xs text-gray-400 mt-0.5">{contact.email}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <WarmthChip warmth={contact.warmth} size="md" />
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{contact.stage}</span>
              <span className="text-sm text-gray-400">{contact.silence_days}d silence</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button className="flex-1 min-w-[140px] bg-accent text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors min-h-[44px]">
            Draft email
          </button>
          <button className="flex-1 min-w-[140px] border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors min-h-[44px]">
            Log meeting
          </button>
          <button className="flex-1 min-w-[140px] border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors min-h-[44px]">
            Add note
          </button>
        </div>
      </div>

      {/* AI Query box */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-primary">Ask about this deal</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="e.g. When did we last talk? What's the next step?"
            className="flex-1 bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition min-h-[44px]"
          />
          <button
            onClick={handleQuery}
            disabled={isQuerying || !query.trim()}
            className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isQuerying ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        {aiResponse && (
          <div className="mt-3 bg-accent-light rounded-xl p-4 text-sm text-primary leading-relaxed whitespace-pre-line animate-fade-in">
            {aiResponse}
          </div>
        )}
      </div>

      {/* Deal timeline */}
      <div>
        <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Deal Timeline</h3>
        <div className="space-y-3">
          {contact.timeline.map((event, i) => {
            const config = TYPE_ICONS[event.type] || TYPE_ICONS.note
            return (
              <div key={event.id} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${config.bg} ${config.text}`}>
                    {config.icon}
                  </div>
                  {i < contact.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-gray-100 mt-1 mb-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-primary">{event.title}</span>
                    {event.is_inferred && <InferredBadge confidence={event.confidence} />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(event.timestamp), 'MMM d, yyyy')}
                    </span>
                    {event.source && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400 capitalize">via {event.source}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {contact.timeline.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No timeline events yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
