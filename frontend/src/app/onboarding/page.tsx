'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'name' | 'gmail' | 'calendar' | 'notion' | 'done'

const STEPS: Step[] = ['name', 'gmail', 'calendar', 'notion', 'done']

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('name')
  const [form, setForm] = useState({ name: '', company: '' })
  const [connected, setConnected] = useState({
    gmail: false,
    calendar: false,
    notion: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const stepIndex = STEPS.indexOf(currentStep)
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  const handleNext = () => {
    const next = STEPS[stepIndex + 1]
    if (next) setCurrentStep(next)
  }

  const handleConnect = async (provider: 'gmail' | 'calendar' | 'notion') => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setConnected((prev) => ({ ...prev, [provider]: true }))
    setIsLoading(false)
  }

  const handleFinish = () => {
    router.push('/app/today')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <span className="font-semibold text-lg text-primary">Relay</span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
        {currentStep === 'name' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">Welcome to Relay</h2>
              <p className="text-gray-500 mt-1">Let's set up your workspace</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Your name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Priya Mehta"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">
                  Company / Startup name
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="Acme Inc."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>
            </div>
            <button
              onClick={handleNext}
              disabled={!form.name || !form.company}
              className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-target"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === 'gmail' && (
          <div className="space-y-6">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Connect Gmail</h2>
              <p className="text-gray-500 mt-1 text-sm leading-relaxed">
                Relay reads thread metadata only — sender, recipient, subject, and timestamps.
                <span className="text-accent font-medium"> Email body is never accessed.</span>
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Privacy first:</strong> We only read signal data (who, when, how often) to reconstruct deal momentum.
            </div>
            {connected.gmail ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-800 font-medium">Gmail connected!</span>
              </div>
            ) : (
              <button
                onClick={() => handleConnect('gmail')}
                disabled={isLoading}
                className="w-full bg-white border border-gray-200 text-primary py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 touch-target shadow-sm disabled:opacity-60"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Connect Gmail
              </button>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleNext}
                className="flex-1 text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleNext}
                disabled={!connected.gmail}
                className="flex-1 bg-accent text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === 'calendar' && (
          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Connect Calendar</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Meeting participants mapped to contacts. Gaps in meeting cadence flagged automatically.
              </p>
            </div>
            {connected.calendar ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-800 font-medium">Google Calendar connected!</span>
              </div>
            ) : (
              <button
                onClick={() => handleConnect('calendar')}
                disabled={isLoading}
                className="w-full bg-white border border-gray-200 text-primary py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 touch-target shadow-sm disabled:opacity-60"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                Connect Google Calendar
              </button>
            )}
            <div className="flex gap-3">
              <button onClick={handleNext} className="flex-1 text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
                Skip for now
              </button>
              <button
                onClick={handleNext}
                disabled={!connected.calendar}
                className="flex-1 bg-accent text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === 'notion' && (
          <div className="space-y-6">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Connect Notion</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Relay reads your pipeline database and writes summaries back — append-only.
                Your source of truth is never overwritten.
              </p>
            </div>
            {connected.notion ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-800 font-medium">Notion connected!</span>
              </div>
            ) : (
              <button
                onClick={() => handleConnect('notion')}
                disabled={isLoading}
                className="w-full bg-white border border-gray-200 text-primary py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 touch-target shadow-sm disabled:opacity-60"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466z" />
                  </svg>
                )}
                Connect Notion
              </button>
            )}
            <div className="flex gap-3">
              <button onClick={handleNext} className="flex-1 text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
                Skip for now
              </button>
              <button
                onClick={handleNext}
                disabled={!connected.notion}
                className="flex-1 bg-accent text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === 'done' && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">You're all set!</h2>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Relay is now reconstructing your deal activity.
                Your Today View will be ready in a few moments.
              </p>
            </div>
            <div className="bg-background rounded-xl p-4 space-y-2 text-left">
              {[
                { label: 'Gmail', status: connected.gmail },
                { label: 'Google Calendar', status: connected.calendar },
                { label: 'Notion', status: connected.notion },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={item.status ? 'text-green-600' : 'text-gray-400'}>
                    {item.status ? '✓ Connected' : 'Not connected'}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleFinish}
              className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors touch-target"
            >
              Go to Today View →
            </button>
          </div>
        )}
      </div>

      {/* Step dots */}
      <div className="flex gap-2 mt-6">
        {STEPS.map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full transition-colors ${
              step === currentStep ? 'bg-accent' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
