// ============================================================
// src/components/ui/MonthlyInsight.jsx
// "You spent X% more/less than last month" insight card.
// ============================================================

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'

export default function MonthlyInsight({ monthlyComparison }) {
  const { curExp, prevExp, percentChange } = monthlyComparison
  const pct = parseFloat(percentChange)
  const isMore = pct > 0
  const isSame = pct === 0

  const monthName = new Date().toLocaleString('default', { month: 'long' })

  return (
    <div className="card p-4 flex items-start gap-3">
      {/* Icon */}
      <div className={`p-2.5 rounded-xl flex-shrink-0 ${
        isSame ? 'bg-surface-100 dark:bg-surface-800' :
        isMore  ? 'bg-danger-50 dark:bg-danger-900/30' : 'bg-brand-50 dark:bg-brand-900/30'
      }`}>
        {isSame
          ? <Minus className="w-5 h-5 text-surface-400" />
          : isMore
            ? <TrendingUp className="w-5 h-5 text-danger-500" />
            : <TrendingDown className="w-5 h-5 text-brand-500" />
        }
      </div>

      {/* Text */}
      <div>
        <p className="font-display font-semibold text-sm text-surface-800 dark:text-surface-200">
          Monthly Insight
        </p>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
          {isSame
            ? `Your spending in ${monthName} is on par with last month.`
            : isMore
              ? `You spent ${Math.abs(pct)}% more in ${monthName} than last month.`
              : `Great! You spent ${Math.abs(pct)}% less in ${monthName} than last month.`
          }
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-surface-400">
          <span>This month: <strong className="text-surface-700 dark:text-surface-300">{formatCurrency(curExp)}</strong></span>
          <span>Last month: <strong className="text-surface-700 dark:text-surface-300">{formatCurrency(prevExp)}</strong></span>
        </div>
      </div>
    </div>
  )
}
