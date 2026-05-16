// ============================================================
// src/components/ui/StatCard.jsx
// Summary cards: Balance, Expenses, Savings.
// ============================================================

import React from 'react'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'

const CONFIG = {
  balance: {
    label:   'Account Balance',
    icon:    Wallet,
    gradient: 'from-brand-500 to-brand-600',
    bg:      'bg-gradient-to-br from-brand-500 to-brand-600',
    text:    'text-white',
    sub:     'text-brand-100',
    iconBg:  'bg-white/20',
  },
  expenses: {
    label:   'Total Expenses',
    icon:    TrendingDown,
    gradient: 'from-danger-500 to-danger-600',
    bg:      'bg-white dark:bg-surface-900',
    text:    'text-surface-900 dark:text-white',
    sub:     'text-surface-500 dark:text-surface-400',
    iconBg:  'bg-danger-50 dark:bg-danger-900/30',
    iconColor: 'text-danger-500',
    border:  'border border-surface-100 dark:border-surface-800',
  },
  savings: {
    label:   'Total Savings',
    icon:    TrendingUp,
    gradient: 'from-cyan-500 to-cyan-600',
    bg:      'bg-white dark:bg-surface-900',
    text:    'text-surface-900 dark:text-white',
    sub:     'text-surface-500 dark:text-surface-400',
    iconBg:  'bg-cyan-50 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    border:  'border border-surface-100 dark:border-surface-800',
  },
}

export default function StatCard({ type, amount, percentChange, subtitle }) {
  const cfg = CONFIG[type]
  const Icon = cfg.icon
  const isPositive = percentChange >= 0

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5 shadow-card
        ${cfg.bg} ${cfg.border || ''}
        transition-all duration-200 hover:shadow-card-hover
        animate-slide-up
      `}
    >
      {/* Background decoration for balance card */}
      {type === 'balance' && (
        <>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-2 w-32 h-32 rounded-full bg-white/5" />
        </>
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${cfg.sub}`}>
            {cfg.label}
          </p>
          <p className={`font-display font-bold text-2xl ${cfg.text} truncate`}>
            {formatCurrency(amount)}
          </p>

          {percentChange !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${cfg.sub}`}>
              {isPositive
                ? <ArrowUpRight className="w-3.5 h-3.5 text-brand-400" />
                : <ArrowDownRight className="w-3.5 h-3.5 text-danger-400" />
              }
              <span>{Math.abs(percentChange)}% vs last month</span>
            </div>
          )}

          {subtitle && (
            <p className={`mt-1.5 text-xs ${cfg.sub}`}>{subtitle}</p>
          )}
        </div>

        <div className={`p-2.5 rounded-xl flex-shrink-0 ${cfg.iconBg}`}>
          <Icon className={`w-5 h-5 ${type === 'balance' ? 'text-white' : cfg.iconColor}`} />
        </div>
      </div>
    </div>
  )
}
