// ============================================================
// src/components/layout/Sidebar.jsx
// Responsive sidebar with navigation links.
// ============================================================

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BarChart3, ListFilter, Settings,
  LogOut, ChevronLeft, ChevronRight, Wallet, X
} from 'lucide-react'
import useStore from '../../store/useStore'
import { logOut } from '../../services/authService'

const NAV_ITEMS = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/analytics',  icon: BarChart3,        label: 'Analytics'   },
  { to: '/transactions', icon: ListFilter,     label: 'Transactions' },
  { to: '/settings',   icon: Settings,         label: 'Settings'    },
]

export default function Sidebar() {
  const { user, sidebarOpen, toggleSidebar } = useStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logOut()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          flex flex-col
          bg-white dark:bg-surface-900
          border-r border-surface-100 dark:border-surface-800
          shadow-lg lg:shadow-none
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-60' : 'w-0 lg:w-16 overflow-hidden'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-100 dark:border-surface-800">
          <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-glow-green">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-lg text-surface-900 dark:text-white whitespace-nowrap">
              FlowTrack
            </span>
          )}
          {/* Mobile close button */}
          <button
            onClick={toggleSidebar}
            className="ml-auto lg:hidden text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                font-body text-sm font-medium
                transition-all duration-150
                ${isActive
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                  : 'text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-2 py-3 border-t border-surface-100 dark:border-surface-800 space-y-1">
          {sidebarOpen && user && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 mb-1">
              <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">
                  {user.displayName || 'User'}
                </p>
                <p className="text-xs text-surface-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        >
          {sidebarOpen
            ? <ChevronLeft className="w-3.5 h-3.5 text-surface-500" />
            : <ChevronRight className="w-3.5 h-3.5 text-surface-500" />
          }
        </button>
      </aside>
    </>
  )
}
