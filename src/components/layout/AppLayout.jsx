// ============================================================
// src/components/layout/AppLayout.jsx
// Wraps every authenticated page with sidebar + topbar.
// ============================================================

import React from 'react'
import Sidebar from './Sidebar'
import useStore from '../../store/useStore'

export default function AppLayout({ children }) {
  const { sidebarOpen } = useStore()

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      <Sidebar />

      {/* Main content shifts right when sidebar is open */}
      <main
        className={`
          flex-1 flex flex-col min-h-screen min-w-0
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-16'}
        `}
      >
        {children}
      </main>
    </div>
  )
}
