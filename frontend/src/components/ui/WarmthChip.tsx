import clsx from 'clsx'

type Warmth = 'Hot' | 'Warm' | 'Cooling' | 'Cold'

interface WarmthChipProps {
  warmth: Warmth | string
  size?: 'sm' | 'md'
}

const WARMTH_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Hot: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
    label: '🔥 Hot',
  },
  Warm: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    label: '☀️ Warm',
  },
  Cooling: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    label: '❄️ Cooling',
  },
  Cold: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    dot: 'bg-gray-400',
    label: '🧊 Cold',
  },
}

export default function WarmthChip({ warmth, size = 'sm' }: WarmthChipProps) {
  const config = WARMTH_CONFIG[warmth] || WARMTH_CONFIG.Cold

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bg,
        config.text,
        size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      {config.label}
    </span>
  )
}
