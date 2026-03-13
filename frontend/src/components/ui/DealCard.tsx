'use client'

import { useState } from 'react'
import WarmthChip from './WarmthChip'
import InferredBadge from './InferredBadge'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'

export interface Deal {
  id: string
  contact_name: string
  company: string
  stage: string
  warmth: string
  silence_days: number
  last_activity: string
  notes?: string
  deal_size?: string
  is_inferred?: boolean
  confidence?: number
  next_action?: string
}

interface DealCardProps {
  deal: Deal
  onStageChange?: (id: string, stage: string) => void
}

const STAGES = ['On Radar', 'In Conversation', 'Qualified', 'Proposal Out', 'Closing']

export default function DealCard({ deal, onStageChange }: DealCardProps) {
  const [expanded, setExpanded] = useState(false)

  const silenceColor =
    deal.silence_days >= 14
      ? 'text-red-500'
      : deal.silence_days >= 7
      ? 'text-amber-500'
      : 'text-gray-400'

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border transition-all duration-200 overflow-hidden',
        expanded ? 'border-accent shadow-md' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
      )}
    >
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-4 flex items-start gap-3 min-h-[44px]"
      >
        {/* Avatar */}
        <div className="w-9 h-9 bg-accent-light rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-accent font-semibold text-sm">
            {deal.contact_name.charAt(0)}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-primary text-sm">{deal.contact_name}</span>
            {deal.is_inferred && <InferredBadge confidence={deal.confidence} />}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{deal.company}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <WarmthChip warmth={deal.warmth} />
            <span className={clsx('text-xs font-medium', silenceColor)}>
              {deal.silence_days}d silence
            </span>
            {deal.deal_size && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {deal.deal_size}
              </span>
            )}
          </div>
        </div>

        {/* Expand icon */}
        <div className={clsx('text-gray-400 transition-transform mt-1', expanded && 'rotate-180')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-4 animate-fade-in">
          {/* Stage */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Stage</p>
            <div className="flex gap-1 flex-wrap">
              {STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => onStageChange?.(deal.id, stage)}
                  className={clsx(
                    'text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors min-h-[36px]',
                    deal.stage === stage
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Last activity */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Last Activity</p>
            <p className="text-sm text-gray-600">
              {formatDistanceToNow(new Date(deal.last_activity), { addSuffix: true })}
            </p>
          </div>

          {/* Notes */}
          {deal.notes && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Notes</p>
              <p className="text-sm text-gray-600 leading-relaxed">{deal.notes}</p>
            </div>
          )}

          {/* Next action */}
          {deal.next_action && (
            <div className="bg-accent-light rounded-xl px-3 py-2.5">
              <p className="text-xs font-medium text-accent mb-0.5">Suggested next action</p>
              <p className="text-sm text-primary">{deal.next_action}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
