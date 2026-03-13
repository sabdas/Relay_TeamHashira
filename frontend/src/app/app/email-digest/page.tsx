'use client'

import { formatDistanceToNow } from 'date-fns'
import InferredBadge from '@/components/ui/InferredBadge'
import LoadingAnimation from '@/components/ui/LoadingAnimation'
import { useApi } from '@/hooks/useApi'
import { emailApi } from '@/lib/api'
import { useState } from 'react'

type EmailDigestItem = {
  id: string
  thread_id: string
  contact_name: string | null
  company: string | null
  subject: string | null
  thread_count: number
  last_message: string | null
  reply_latency_hours: number | null
  signal: string
  sentiment: 'positive' | 'neutral' | 'negative'
  is_inferred: boolean
  confidence: number
}

const SENTIMENT_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  positive: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  neutral: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  negative: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
}

export default function EmailDigestPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const { data: threads, isLoading, error } = useApi<EmailDigestItem[]>(() => emailApi.digest())

  if (isLoading) return <LoadingAnimation />

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-primary">Email Digest</h2>
          <p className="text-sm text-gray-400 mt-0.5">Thread metadata signals — email bodies are never read</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          {error.includes('Gmail not connected')
            ? 'Gmail is not connected. Go to Settings → Integrations to connect your Gmail account.'
            : 'Failed to load email digest. Please try again later.'}
        </div>
      </div>
    )
  }

  const items = threads ?? []
  const totalThreads = items.length
  const positiveCount = items.filter((t) => t.sentiment === 'positive').length
  const atRiskCount = items.filter((t) => t.sentiment === 'negative').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary">Email Digest</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Thread metadata signals — email bodies are never read
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-primary">{totalThreads}</div>
          <div className="text-xs text-gray-400 mt-0.5">Active threads</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{positiveCount}</div>
          <div className="text-xs text-gray-400 mt-0.5">Positive signals</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{atRiskCount}</div>
          <div className="text-xs text-gray-400 mt-0.5">At risk</div>
        </div>
      </div>

      {/* Privacy banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">
        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-green-800">Privacy mode active</p>
          <p className="text-xs text-green-700 mt-0.5">
            Relay only reads: sender, recipients, subject line, and timestamps.
            Email bodies, attachments, and CC fields are never processed.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-sm text-gray-400">No email threads synced yet.</p>
        </div>
      )}

      {/* Thread list */}
      <div className="space-y-3">
        {items.map((thread) => {
          const sentiment = SENTIMENT_CONFIG[thread.sentiment] ?? SENTIMENT_CONFIG.neutral
          const isExpanded = expanded === thread.id

          return (
            <div
              key={thread.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : thread.id)}
                className="w-full text-left p-4 flex items-start gap-3 min-h-[44px]"
              >
                {/* Avatar */}
                <div className="w-9 h-9 bg-accent-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-semibold text-sm">
                    {(thread.contact_name ?? '?').charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-primary text-sm">{thread.contact_name ?? 'Unknown'}</span>
                    {thread.company && <span className="text-xs text-gray-400">{thread.company}</span>}
                    {thread.is_inferred && <InferredBadge confidence={thread.confidence} />}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">{thread.subject}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 ${sentiment.bg} ${sentiment.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sentiment.dot}`} />
                      {thread.signal}
                    </span>
                  </div>
                </div>

                {/* Expand */}
                <div className={`text-gray-400 transition-transform mt-1 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3 animate-fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Thread replies</p>
                      <p className="text-sm font-semibold text-primary">{thread.thread_count}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Avg reply time</p>
                      <p className="text-sm font-semibold text-primary">
                        {thread.reply_latency_hours ? `${thread.reply_latency_hours}h` : 'No reply'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Last activity</p>
                      <p className="text-sm font-semibold text-primary">
                        {thread.last_message
                          ? formatDistanceToNow(new Date(thread.last_message), { addSuffix: true })
                          : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-accent text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors min-h-[44px]">
                      Draft follow-up
                    </button>
                    <button className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors min-h-[44px]">
                      View contact
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
