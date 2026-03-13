'use client'

import { useState } from 'react'
import PendingItem, { type PendingAction } from '@/components/ui/PendingItem'

const DEMO_PENDING: PendingAction[] = [
  {
    id: 'p1',
    action_type: 'stage_change',
    contact_name: 'Arjun Malhotra',
    company: 'Kira Health',
    description: 'Relay detected 3 positive reply signals and a demo scheduled. Suggested move from Qualified → Proposal Out.',
    payload: { from_stage: 'Qualified', to_stage: 'Proposal Out', confidence: 89 },
    requires_approval: true,
    approved: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'p2',
    action_type: 'stage_change',
    contact_name: 'Priya Sharma',
    company: 'Meesho',
    description: 'Contract reviewed + legal sign-off email detected. Suggested move from Proposal Out → Closing.',
    payload: { from_stage: 'Proposal Out', to_stage: 'Closing', confidence: 94 },
    requires_approval: true,
    approved: false,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'p3',
    action_type: 'note',
    contact_name: 'Vikram Nair',
    company: 'Razorpay',
    description: 'New note inferred from calendar meeting: "Team alignment call — 4 participants, 45 min. Key topic: enterprise security requirements."',
    payload: { note: 'Team alignment call — 4 participants, 45 min. Key topic: enterprise security requirements.', source: 'calendar' },
    requires_approval: true,
    approved: false,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: 'p4',
    action_type: 'note',
    contact_name: 'Sneha Kapoor',
    company: 'Groww',
    description: 'Note inferred from email thread: "Replied to security questionnaire. Mentioned 2-week legal review process."',
    payload: { note: 'Replied to security questionnaire. 2-week legal review in progress.', source: 'gmail' },
    requires_approval: true,
    approved: false,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: 'p5',
    action_type: 'contact',
    contact_name: 'Rohan Verma',
    company: 'Swiggy',
    description: 'New contact detected via calendar invite from Vikram Nair (Razorpay). Rohan Verma — Head of Product, Swiggy.',
    payload: { email: 'rohan.verma@swiggy.in', role: 'Head of Product', referred_by: 'Vikram Nair' },
    requires_approval: true,
    approved: false,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
]

export default function PendingPage() {
  const [actions, setActions] = useState(DEMO_PENDING)

  const pendingCount = actions.filter((a) => !a.approved).length

  const handleApprove = async (id: string) => {
    await new Promise((r) => setTimeout(r, 600))
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, approved: true } : a))
    )
  }

  const handleReject = async (id: string) => {
    await new Promise((r) => setTimeout(r, 400))
    setActions((prev) => prev.filter((a) => a.id !== id))
  }

  const approveAll = async () => {
    for (const action of actions.filter((a) => !a.approved)) {
      await handleApprove(action.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Pending Approvals</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {pendingCount} action{pendingCount !== 1 ? 's' : ''} awaiting your review
          </p>
        </div>
        {pendingCount > 0 && (
          <button
            onClick={approveAll}
            className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Approve All
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="bg-accent-light border border-indigo-200 rounded-2xl p-4 flex gap-3">
        <div className="text-accent flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-accent">How Relay infers actions</p>
          <p className="text-xs text-indigo-600 mt-0.5 leading-relaxed">
            Relay reads email metadata (subject, sender, timestamps) and calendar events to detect deal signals.
            All inferred actions require your approval before any changes are saved.
          </p>
        </div>
      </div>

      {/* Actions list */}
      {actions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs mt-1">No pending actions right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => (
            <PendingItem
              key={action.id}
              action={action}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  )
}
