// ============================================================
// src/components/layout/TopBar.jsx
// Top navigation bar with menu toggle, page title, dark mode.
// ============================================================

import React from 'react'
import { Menu, Moon, Sun, Bell, Plus } from 'lucide-react'
import useStore from '../../store/useStore'

export default function TopBar({ title, onAddTransaction }) {
  const { darkMode, toggleDarkMode, toggleSidebar } = useStore()

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-100 dark:border-surface-800">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="font-display font-bold text-lg text-surface-900 dark:text-white flex-1 truncate">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        {/* Add transaction shortcut */}
        {onAddTransaction && (
          <button
            onClick={onAddTransaction}
            className="btn-primary hidden sm:inline-flex"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode
            ? <Sun className="w-5 h-5 text-amber-400" />
            : <Moon className="w-5 h-5" />
          }
        </button>
      </div>
    </header>
  )
}
