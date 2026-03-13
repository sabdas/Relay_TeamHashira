'use client'

interface LoadingAnimationProps {
  message?: string
  submessage?: string
}

export default function LoadingAnimation({
  message = 'Reconstructing deal activity…',
  submessage = 'Reading signals from Gmail, Calendar, and Notion',
}: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Animated dots */}
      <div className="flex items-end gap-1.5 mb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-accent pulse-dot"
            style={{
              height: `${12 + i * 6}px`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
        {[3, 2, 1, 0].map((i) => (
          <div
            key={`r${i}`}
            className="w-1.5 rounded-full bg-accent pulse-dot"
            style={{
              height: `${12 + i * 6}px`,
              animationDelay: `${(5 + (3 - i)) * 0.15}s`,
            }}
          />
        ))}
      </div>

      <p className="text-base font-medium text-primary mb-1">{message}</p>
      <p className="text-sm text-gray-400">{submessage}</p>

      {/* Progress steps */}
      <div className="mt-8 space-y-2 text-left max-w-xs w-full">
        {[
          { label: 'Scanning Gmail threads', done: true },
          { label: 'Mapping calendar participants', done: true },
          { label: 'Reading Notion pipeline', done: false },
          { label: 'Calculating warmth scores', done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div
              className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                step.done ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              {step.done ? (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 pulse-dot" style={{ animationDelay: `${i * 0.3}s` }} />
              )}
            </div>
            <span className={step.done ? 'text-gray-600' : 'text-gray-400'}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
