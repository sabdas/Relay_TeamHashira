import clsx from 'clsx'

interface InferredBadgeProps {
  confidence?: number // 0–100
  label?: string
  size?: 'sm' | 'md'
}

export default function InferredBadge({
  confidence,
  label = 'Inferred — not recorded',
  size = 'sm',
}: InferredBadgeProps) {
  const confidenceColor =
    confidence !== undefined
      ? confidence >= 80
        ? 'text-green-600'
        : confidence >= 50
        ? 'text-amber-600'
        : 'text-red-500'
      : 'text-gray-400'

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md bg-gray-100 text-gray-500 font-medium',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      )}
      title={confidence !== undefined ? `Confidence: ${confidence}%` : undefined}
    >
      <svg className="w-3 h-3 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span>⚑ {label}</span>
      {confidence !== undefined && (
        <span className={clsx('font-semibold', confidenceColor)}>{confidence}%</span>
      )}
    </span>
  )
}
