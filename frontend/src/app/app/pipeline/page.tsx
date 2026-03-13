'use client'

import { useState } from 'react'
import KanbanBoard, { type KanbanColumn } from '@/components/ui/KanbanBoard'
import { type KanbanDeal } from '@/components/ui/KanbanCard'
import LoadingAnimation from '@/components/ui/LoadingAnimation'
import { useApi } from '@/hooks/useApi'
import { dealsApi } from '@/lib/api'

const STAGES = ['On Radar', 'In Conversation', 'Qualified', 'Proposal Out', 'Closing']

export default function PipelinePage() {
  const { data: columns, isLoading } = useApi<KanbanColumn[]>(() => dealsApi.pipeline())
  const [selectedDeal, setSelectedDeal] = useState<KanbanDeal | null>(null)

  if (isLoading) return <LoadingAnimation />

  const allDeals = (columns ?? []).flatMap((c) => c.deals)

  const totalValue = allDeals
    .filter((d) => d.deal_size && d.deal_size !== 'TBD')
    .reduce((sum, d) => {
      const val = parseFloat(d.deal_size?.replace(/[₹L ARR]/g, '') || '0')
      return sum + val
    }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Pipeline</h2>
          <p className="text-sm text-gray-400 mt-0.5">{allDeals.length} deals · ₹{totalValue}L ARR tracked</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors min-h-[44px]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Deal
        </button>
      </div>

      {/* Stage summary */}
      <div className="grid grid-cols-5 gap-2">
        {STAGES.map((stage) => {
          const count = allDeals.filter((d) => d.stage === stage).length
          return (
            <div key={stage} className="text-center">
              <div className="text-xl font-bold text-primary">{count}</div>
              <div className="text-xs text-gray-400 mt-0.5 leading-tight">{stage}</div>
            </div>
          )
        })}
      </div>

      {/* Kanban board — horizontal scroll on mobile */}
      <div className="-mx-4 md:-mx-6 px-4 md:px-6">
        <KanbanBoard
          columns={columns ?? []}
          onCardClick={(deal) => setSelectedDeal(deal)}
        />
      </div>

      {/* Deal detail modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-primary">{selectedDeal.contact_name}</h3>
                <p className="text-sm text-gray-400">{selectedDeal.company}</p>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-2 text-gray-400 hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Stage</p>
                  <p className="text-sm font-medium text-primary">{selectedDeal.stage}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Silence</p>
                  <p className="text-sm font-medium text-primary">{selectedDeal.silence_days} days</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Deal size</p>
                  <p className="text-sm font-medium text-primary">{selectedDeal.deal_size || 'TBD'}</p>
                </div>
              </div>

              {selectedDeal.next_action && (
                <div className="bg-accent-light rounded-xl p-3">
                  <p className="text-xs font-medium text-accent mb-1">Next action</p>
                  <p className="text-sm text-primary">{selectedDeal.next_action}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 bg-accent text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors min-h-[44px]">
                  View Contact
                </button>
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
