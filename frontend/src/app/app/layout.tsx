'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { AppProvider, useApp } from '@/context/AppContext'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import clsx from 'clsx'

const NAV_ITEMS = [
  { href: '/app/today', label: 'Today' },
  { href: '/app/pipeline', label: 'Pipeline' },
  { href: '/app/pending', label: 'Pending' },
  { href: '/app/contacts', label: 'Contacts' },
  { href: '/app/email-digest', label: 'Email Digest' },
  { href: '/app/settings', label: 'Settings' },
]

function MobileSidebarOverlay() {
  const { sidebarOpen, setSidebarOpen } = useApp()
  const pathname = usePathname()

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname, setSidebarOpen])

  if (!sidebarOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
        onClick={() => setSidebarOpen(false)}
      />
      <div className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-white shadow-xl md:hidden flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-primary">Relay</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center px-4 py-3 rounded-xl text-sm font-medium min-h-[44px] transition-colors',
                pathname === item.href
                  ? 'bg-accent-light text-accent'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('relay_demo')
      if (!isDemo) {
        router.push('/')
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading Relay…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebarOverlay />
      <Header />
      <main className="md:pl-60 pt-14 pb-20 md:pb-6 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell>{children}</AppShell>
      </AppProvider>
    </AuthProvider>
  )
}
