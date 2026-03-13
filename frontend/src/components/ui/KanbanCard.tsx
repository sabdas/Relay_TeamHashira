'use client'

import WarmthChip from './WarmthChip'
import clsx from 'clsx'

export interface KanbanDeal {
  id: string
  contact_name: string
  company: string
  warmth: string
  silence_days: number
  deal_size?: string
  stage: string
  last_activity: string
  next_action?: string
}

interface KanbanCardProps {
  deal: KanbanDeal
  onClick?: () => void
}

export default function KanbanCard({ deal, onClick }: KanbanCardProps) {
  const silenceColor =
    deal.silence_days >= 14
      ? 'text-red-500 bg-red-50'
      : deal.silence_days >= 7
      ? 'text-amber-600 bg-amber-50'
      : 'text-gray-400 bg-gray-50'

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer active:scale-98"
    >
      {/* Contact */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 bg-accent-light rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-accent font-semibold text-xs">
            {deal.contact_name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-primary text-sm truncate">{deal.contact_name}</p>
          <p className="text-xs text-gray-400 truncate">{deal.company}</p>
        </div>
      </div>

      {/* Warmth + silence */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <WarmthChip warmth={deal.warmth} />
        <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', silenceColor)}>
          {deal.silence_days}d
        </span>
      </div>

      {/* Deal size */}
      {deal.deal_size && (
        <div className="mt-2 text-xs text-gray-500 font-medium">{deal.deal_size}</div>
      )}

      {/* Next action hint */}
      {deal.next_action && (
        <div className="mt-2.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5 line-clamp-2">
          → {deal.next_action}
        </div>
      )}
    </div>
  )
}
