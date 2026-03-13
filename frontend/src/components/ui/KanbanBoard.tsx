'use client'

import KanbanCard, { type KanbanDeal } from './KanbanCard'
import clsx from 'clsx'

export interface KanbanColumn {
  id: string
  title: string
  deals: KanbanDeal[]
  color: string
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardClick?: (deal: KanbanDeal) => void
  onDealMove?: (dealId: string, toStage: string) => void
}

const COLUMN_COLORS: Record<string, string> = {
  'On Radar': 'bg-gray-100 text-gray-600',
  'In Conversation': 'bg-blue-100 text-blue-700',
  Qualified: 'bg-amber-100 text-amber-700',
  'Proposal Out': 'bg-indigo-100 text-indigo-700',
  Closing: 'bg-green-100 text-green-700',
}

export default function KanbanBoard({ columns, onCardClick }: KanbanBoardProps) {
  return (
    <div className="kanban-container flex gap-4 pb-4 pt-2 px-0.5 min-h-[calc(100vh-200px)]">
      {columns.map((col) => (
        <div
          key={col.id}
          className="kanban-column flex flex-col min-w-[280px] w-[280px] md:min-w-[300px] md:w-[300px]"
        >
          {/* Column header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'text-xs font-semibold px-2.5 py-1 rounded-full',
                  COLUMN_COLORS[col.title] || 'bg-gray-100 text-gray-600'
                )}
              >
                {col.title}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium bg-white border border-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
              {col.deals.length}
            </span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2.5 flex-1 bg-gray-50 rounded-2xl p-3 min-h-[120px]">
            {col.deals.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-300 text-sm py-8">
                No deals
              </div>
            ) : (
              col.deals.map((deal) => (
                <KanbanCard
                  key={deal.id}
                  deal={deal}
                  onClick={() => onCardClick?.(deal)}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
