'use client'

import { useState } from 'react'
import clsx from 'clsx'

export interface PendingAction {
  id: string
  action_type: 'stage_change' | 'note' | 'contact' | 'follow_up'
  contact_name?: string
  company?: string
  description: string
  payload: Record<string, unknown>
  requires_approval: boolean
  approved: boolean
  created_at: string
}

interface PendingItemProps {
  action: PendingAction
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

const TYPE_CONFIG: Record<string, { label: string; icon: string; bg: string; text: string }> = {
  stage_change: {
    label: 'Stage Change',
    icon: '→',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
  note: {
    label: 'New Note',
    icon: '📝',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  contact: {
    label: 'New Contact',
    icon: '👤',
    bg: 'bg-green-50',
    text: 'text-green-700',
  },
  follow_up: {
    label: 'Follow-up',
    icon: '↩️',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
}

export default function PendingItem({ action, onApprove, onReject }: PendingItemProps) {
  const [isActing, setIsActing] = useState(false)
  const config = TYPE_CONFIG[action.action_type] || TYPE_CONFIG.note

  const handleApprove = async () => {
    setIsActing(true)
    await onApprove(action.id)
    setIsActing(false)
  }

  const handleReject = async () => {
    setIsActing(true)
    await onReject(action.id)
    setIsActing(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Type badge */}
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base', config.bg)}>
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', config.bg, config.text)}>
              {config.label}
            </span>
            {action.contact_name && (
              <span className="text-sm font-medium text-primary">{action.contact_name}</span>
            )}
            {action.company && (
              <span className="text-xs text-gray-400">· {action.company}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mt-1">{action.description}</p>

          {/* Payload details */}
          {action.action_type === 'stage_change' && action.payload.from_stage && (
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                {action.payload.from_stage as string}
              </span>
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="bg-accent-light text-accent px-2 py-1 rounded-lg font-medium">
                {action.payload.to_stage as string}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {action.requires_approval && !action.approved && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleReject}
            disabled={isActing}
            className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px]"
          >
            Dismiss
          </button>
          <button
            onClick={handleApprove}
            disabled={isActing}
            className="flex-1 py-2.5 px-4 bg-accent text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
          >
            {isActing ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            Approve
          </button>
        </div>
      )}

      {action.approved && (
        <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approved
        </div>
      )}
    </div>
  )
}
