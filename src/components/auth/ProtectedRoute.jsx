// ============================================================
// src/components/auth/ProtectedRoute.jsx
// Redirects unauthenticated users to /login.
// ============================================================

import React from 'react'
import { Navigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { Wallet } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useStore()

  // Show spinner while Firebase resolves auth state
  if (loading && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-50 dark:bg-surface-950">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow-green">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div className="w-6 h-6 border-2 border-surface-200 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-sm text-surface-400 font-medium">Loading your data…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
