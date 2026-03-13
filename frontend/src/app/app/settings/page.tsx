'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const INTEGRATIONS = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Thread metadata only — sender, subject, timestamps',
    icon: '📬',
    connected: true,
    lastSync: '2 min ago',
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Meeting participants and timing signals',
    icon: '📅',
    connected: true,
    lastSync: '5 min ago',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Pipeline database — append-only writes',
    icon: '🗂️',
    connected: false,
    lastSync: null,
  },
]

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [integrations, setIntegrations] = useState(INTEGRATIONS)
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleToggle = async (id: string) => {
    const integration = integrations.find((i) => i.id === id)
    if (!integration) return

    if (integration.connected) {
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, connected: false, lastSync: null } : i))
      )
    } else {
      setConnecting(id)
      await new Promise((r) => setTimeout(r, 1200))
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, connected: true, lastSync: 'just now' } : i
        )
      )
      setConnecting(null)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary">Settings</h2>
        <p className="text-sm text-gray-400 mt-0.5">Manage integrations and account preferences</p>
      </div>

      {/* Account */}
      {user && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Account</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-primary">{user.name}</p>
              <p className="text-sm text-gray-400">{user.company}</p>
              {user.is_demo_user && (
                <span className="inline-flex mt-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  Demo account
                </span>
              )}
            </div>
          </div>
          <div className="pt-2 border-t border-gray-50">
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors min-h-[44px] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </section>
      )}

      {/* Integrations */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Integrations</h3>
        <div className="space-y-3">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
            >
              <div className="text-2xl flex-shrink-0">{integration.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary text-sm">{integration.name}</span>
                  {integration.connected ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Connected
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Not connected
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{integration.description}</p>
                {integration.lastSync && (
                  <p className="text-xs text-gray-300 mt-0.5">Last sync: {integration.lastSync}</p>
                )}
              </div>
              <button
                onClick={() => handleToggle(integration.id)}
                disabled={connecting === integration.id}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-colors min-h-[44px] min-w-[80px] flex items-center justify-center ${
                  integration.connected
                    ? 'border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                    : 'bg-accent text-white hover:bg-indigo-700'
                } disabled:opacity-50`}
              >
                {connecting === integration.id ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : integration.connected ? (
                  'Disconnect'
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Privacy & Data</h3>
        <div className="space-y-3">
          {[
            {
              title: 'Email body access',
              description: 'Relay never reads email content — only metadata (subject, sender, timestamps)',
              status: 'Never enabled',
              safe: true,
            },
            {
              title: 'Notion overwrites',
              description: 'Relay only appends to your Notion database — never overwrites existing content',
              status: 'Append-only',
              safe: true,
            },
            {
              title: 'Data retention',
              description: 'All data is deleted when you disconnect an integration',
              status: 'On disconnect',
              safe: true,
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
              </div>
              <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Daily digest email', enabled: true },
            { label: 'Pending action alerts', enabled: true },
            { label: 'Off-track deal warnings', enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-primary">{item.label}</span>
              <button
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  item.enabled ? 'bg-accent' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    item.enabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="border border-red-100 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider">Danger Zone</h3>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-primary">Delete all data</p>
            <p className="text-xs text-gray-400">Permanently delete all your data from Relay</p>
          </div>
          <button className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-colors min-h-[44px]">
            Delete account
          </button>
        </div>
      </section>
    </div>
  )
}
