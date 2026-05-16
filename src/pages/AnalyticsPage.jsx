// ============================================================
// src/pages/AnalyticsPage.jsx
// Full analytics: Pie, Bar, Line charts + filters.
// ============================================================

import React, { useState, useMemo } from 'react'
import AppLayout from '../components/layout/AppLayout'
import TopBar from '../components/layout/TopBar'
import { CategoryPieChart, MonthlyBarChart, TrendLineChart } from '../components/charts/Charts'
import { buildCategoryData, buildMonthlyData, buildTrendData, calculateTotals, formatCurrency, getTransactionType } from '../utils/helpers'
import useStore from '../store/useStore'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

const ANALYTICS_TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'expense',  label: 'Expenses', icon: '💸' },
  { id: 'saving',   label: 'Savings',  icon: '📈' },
]

export default function AnalyticsPage() {
  const { transactions, getAllCategories } = useStore()
  const categories = getAllCategories()

  // Filters state
  const [filterMonth, setFilterMonth] = useState(0)          // 0 = all
  const [filterYear,  setFilterYear]  = useState(0)          // 0 = all
  const [filterType,  setFilterType]  = useState('overview')

  // Apply filters
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterMonth && tx.month !== filterMonth) return false
      if (filterYear  && tx.year  !== filterYear)  return false
      if (filterType !== 'overview' && getTransactionType(tx, categories) !== filterType) return false
      return true
    })
  }, [transactions, filterMonth, filterYear, filterType, categories])

  // Chart data
  const pieData  = useMemo(() => buildCategoryData(filtered, categories), [filtered, categories])
  const barData  = useMemo(() => buildMonthlyData(transactions, categories), [transactions, categories])
  const lineData = useMemo(() => buildTrendData(transactions, categories),   [transactions, categories])

  // Top categories summary
  const topCategories = pieData.slice(0, 5)
  const filteredTotals = useMemo(() => calculateTotals(filtered, categories), [filtered, categories])
  const totalFiltered = filterType === 'overview'
    ? Math.abs(filteredTotals.income) + filteredTotals.expenses + filteredTotals.savings
    : filtered.reduce((s, t) => s + t.amount, 0)
  const displayedTotal = filterType === 'overview' ? filteredTotals.balance : totalFiltered

  return (
    <AppLayout>
      <TopBar title="Analytics" />

      <div className="flex-1 p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-surface-600 dark:text-surface-400">Filter:</span>

            {/* Type */}
            <div className="flex rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 p-1 bg-surface-50 dark:bg-surface-800">
              {ANALYTICS_TABS.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilterType(type.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterType === type.id
                      ? type.id === 'expense'
                        ? 'bg-danger-500 text-white shadow-sm'
                        : type.id === 'saving'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-brand-500 text-white shadow-sm'
                      : 'text-surface-500 dark:text-surface-400'
                  }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>

            {/* Month */}
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(+e.target.value)}
              className="input-base py-1.5 w-auto text-sm"
            >
              <option value={0}>All Months</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>

            {/* Year */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(+e.target.value)}
              className="input-base py-1.5 w-auto text-sm"
            >
              <option value={0}>All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {(filterMonth || filterYear) && (
              <button
                onClick={() => { setFilterMonth(0); setFilterYear(0) }}
                className="text-xs text-danger-500 hover:text-danger-600 px-2 py-1 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20"
              >
                Reset
              </button>
            )}

            {/* Total */}
            <div className="ml-auto">
              <span className="text-xs text-surface-500 dark:text-surface-400">
                {filterType === 'overview' ? 'Net balance: ' : 'Filtered total: '}
              </span>
              <span className={`font-mono font-semibold text-sm ${
                filterType === 'expense'
                  ? 'text-danger-500'
                  : filterType === 'saving'
                  ? 'text-cyan-600'
                  : 'text-brand-600'
              }`}>
                {formatCurrency(displayedTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pie chart */}
          <div className="card p-5">
            <h2 className="section-title mb-1">Category Breakdown</h2>
            <p className="text-xs text-surface-400 mb-4">
              {filterType === 'overview' ? 'All money movement' : ANALYTICS_TABS.find((type) => type.id === filterType)?.label} by category
            </p>
            <CategoryPieChart data={pieData} />

            {/* Legend list */}
            {topCategories.length > 0 && (
              <div className="mt-4 space-y-2">
                {topCategories.map((item) => {
                  const pct = totalFiltered > 0 ? ((item.value / totalFiltered) * 100).toFixed(1) : 0
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-surface-600 dark:text-surface-400 flex-1 truncate">
                        {item.icon} {item.name}
                      </span>
                      <span className="text-xs font-mono text-surface-500">{pct}%</span>
                      <span className="text-xs font-mono font-semibold text-surface-700 dark:text-surface-300">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bar chart */}
          <div className="card p-5">
            <h2 className="section-title mb-1">Monthly Cash Flow</h2>
            <p className="text-xs text-surface-400 mb-4">Income, expenses, and savings for the last 12 months</p>
            <MonthlyBarChart data={barData} />
          </div>

          {/* Line chart — full width */}
          <div className="card p-5 lg:col-span-2">
            <h2 className="section-title mb-1">Balance Trend</h2>
            <p className="text-xs text-surface-400 mb-4">Cumulative balance over time</p>
            <TrendLineChart data={lineData} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
