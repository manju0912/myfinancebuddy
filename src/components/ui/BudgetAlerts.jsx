// ============================================================
// src/components/ui/BudgetAlerts.jsx
// Shows alerts when spending approaches/exceeds budget limits.
// ============================================================

import React, { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import useStore from '../../store/useStore'
import { checkBudgetAlerts, formatCurrency } from '../../utils/helpers'

export default function BudgetAlerts() {
  const { transactions, budgetLimits, getAllCategories } = useStore()
  const categories = getAllCategories()

  const now = new Date()
  const alerts = checkBudgetAlerts(
    transactions, budgetLimits,
    now.getMonth() + 1, now.getFullYear()
  )

  const [dismissed, setDismissed] = useState([])
  const visible = alerts.filter((a) => !dismissed.includes(a.catId))

  if (visible.length === 0) return null

  return (
    <div className="space-y-2">
      {visible.map((alert) => {
        const cat = categories.find((c) => c.id === alert.catId)
        return (
          <div
            key={alert.catId}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-xl border text-sm
              animate-slide-up
              ${alert.exceeded
                ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
              }
            `}
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="flex-1">
              <span className="font-semibold">{cat?.icon} {cat?.name}: </span>
              {alert.exceeded
                ? `Budget exceeded! Spent ${formatCurrency(alert.spent)} of ${formatCurrency(alert.limit)} limit.`
                : `${alert.pct}% of budget used (${formatCurrency(alert.spent)} / ${formatCurrency(alert.limit)}).`
              }
            </p>
            <button
              onClick={() => setDismissed((d) => [...d, alert.catId])}
              className="text-current opacity-60 hover:opacity-100 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
