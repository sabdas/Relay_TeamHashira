'use client'

import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

const PAGE_TITLES: Record<string, string> = {
  '/app/today': 'Today',
  '/app/pipeline': 'Pipeline',
  '/app/pending': 'Pending',
  '/app/contacts': 'Contacts',
  '/app/email-digest': 'Email Digest',
  '/app/settings': 'Settings',
}

export default function Header() {
  const { user, logout } = useAuth()
  const { setSidebarOpen } = useApp()
  const pathname = usePathname()

  const title = PAGE_TITLES[pathname] || 'Relay'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="fixed top-0 left-0 right-0 md:left-60 z-20 h-14 bg-surface border-b border-border-subtle flex items-center px-4 md:px-6 gap-4">
      {/* Mobile: hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 -ml-2 text-ink-3 hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile logo */}
      <Link href="/app/today" className="md:hidden">
        <Logo size="sm" />
      </Link>

      {/* Desktop title */}
      <div className="hidden md:block flex-1">
        <h1 className="font-semibold text-base text-primary">{title}</h1>
        <p className="text-xs text-ink-4">{today}</p>
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {user?.is_demo_user && (
          <span className="hidden sm:inline-flex text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
            Demo mode
          </span>
        )}

        {/* User avatar */}
        {user && (
          <button
            onClick={logout}
            title={`${user.name} — Sign out`}
            className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:opacity-80 transition-opacity min-h-[44px] min-w-[44px]"
          >
            <span className="text-white text-xs font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </button>
        )}
      </div>
    </header>
  )
}
