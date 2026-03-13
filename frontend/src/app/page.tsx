'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/demo/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('relay_token', data.access_token)
        localStorage.setItem('relay_user', JSON.stringify(data.user))
        router.push('/app/today')
      }
    } catch (err) {
      console.error('Demo login failed', err)
      // Fallback: go to today with demo flag
      localStorage.setItem('relay_demo', 'true')
      router.push('/app/today')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    window.location.href = `${apiUrl}/api/auth/google`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-lg text-primary">Relay</span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="text-sm text-gray-500 hover:text-primary transition-colors touch-target flex items-center"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-2xl w-full text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            Founder Deal Memory System
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
            Your deals,{' '}
            <span className="text-accent">reconstructed.</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
            Relay automatically reconstructs deal activity from Gmail, Calendar, and Notion —
            turning scattered signals into a daily action surface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-medium text-base hover:bg-indigo-700 transition-colors touch-target disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading demo…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Try Demo
                </>
              )}
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-primary px-6 py-3 rounded-xl font-medium text-base hover:bg-gray-50 transition-colors touch-target shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Demo mode uses mock data. No real emails or calendar accessed.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            {
              icon: '📬',
              title: 'Gmail Signals',
              desc: 'Thread metadata reconstructed into deal activity — no body content ever read.',
            },
            {
              icon: '📅',
              title: 'Calendar Intelligence',
              desc: 'Meetings mapped to contacts. Silence gaps flagged. Momentum tracked.',
            },
            {
              icon: '🗂️',
              title: 'Notion Pipeline',
              desc: 'Append-only writes. Your source of truth never overwritten.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-primary mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400">
        © 2024 Relay. Built for founders who move fast.
      </footer>
    </div>
  )
}
