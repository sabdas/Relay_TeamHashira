interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
  const dashWidth = size === 'sm' ? 'w-4' : size === 'lg' ? 'w-8' : 'w-5'
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2'

  return (
    <div className="flex items-center gap-0.5">
      <span className={`font-serif font-semibold text-primary tracking-tight lowercase ${textSize}`}>
        relay.
      </span>
      <span className="flex items-center">
        <span className={`${dashWidth} border-t border-dashed border-accent/50 mx-0.5`} />
        <span className={`${dotSize} rounded-full bg-accent flex-shrink-0`} />
      </span>
    </div>
  )
}
