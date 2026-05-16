// ============================================================
// src/utils/helpers.js
// Pure utility functions used across the app.
// ============================================================

import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'

// ── Currency formatting ──────────────────────────────────────
export function formatCurrency(amount, currency = 'INR', compact = false) {
  const abs = Math.abs(amount)
  const opts = { style: 'currency', currency, maximumFractionDigits: 2 }
  if (compact && abs >= 1000) opts.notation = 'compact'
  return new Intl.NumberFormat('en-US', opts).format(amount)
}

// ── Date helpers ─────────────────────────────────────────────
export function formatDate(dateStr) {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getLast12Months() {
  return eachMonthOfInterval({
    start: subMonths(new Date(), 11),
    end:   new Date(),
  }).map((d) => ({
    month: d.getMonth() + 1,
    year:  d.getFullYear(),
    label: format(d, 'MMM yy'),
  }))
}

// ── Analytics helpers ────────────────────────────────────────

/**
 * Aggregate transactions into monthly bar chart data.
 */
export function buildMonthlyData(transactions) {
  const months = getLast12Months()
  return months.map(({ month, year, label }) => {
    const txs = transactions.filter((t) => t.month === month && t.year === year)
    const expenses = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const savings  = txs.filter((t) => t.type === 'saving').reduce((s, t) => s + t.amount, 0)
    return { label, month, year, expenses, savings }
  })
}

/**
 * Aggregate transactions by category for a pie chart.
 */
export function buildCategoryData(transactions, categories) {
  const map = {}
  transactions.forEach((tx) => {
    map[tx.category] = (map[tx.category] || 0) + tx.amount
  })
  return Object.entries(map)
    .map(([catId, value]) => {
      const cat = categories.find((c) => c.id === catId)
      return {
        name:  cat?.name || catId,
        value: parseFloat(value.toFixed(2)),
        color: cat?.color || '#94a3b8',
        icon:  cat?.icon || '💸',
      }
    })
    .sort((a, b) => b.value - a.value)
}

/**
 * Build line chart trend data.
 */
export function buildTrendData(transactions) {
  const months = getLast12Months()
  let cumBalance = 0
  return months.map(({ month, year, label }) => {
    const txs = transactions.filter((t) => t.month === month && t.year === year)
    const exp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const sav = txs.filter((t) => t.type === 'saving').reduce((s, t) => s + t.amount, 0)
    cumBalance += sav - exp
    return { label, expenses: exp, savings: sav, balance: parseFloat(cumBalance.toFixed(2)) }
  })
}

// ── CSV export ───────────────────────────────────────────────
export function exportToCSV(transactions, categories) {
  const header = 'Date,Type,Category,Amount,Notes,Month,Year'
  const rows = transactions.map((tx) => {
    const cat = categories.find((c) => c.id === tx.category)
    return [
      tx.date,
      tx.type,
      cat?.name || tx.category,
      tx.amount,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
      tx.month,
      tx.year,
    ].join(',')
  })
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flowtrack-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Budget helpers ────────────────────────────────────────────
export function checkBudgetAlerts(transactions, budgetLimits, month, year) {
  const alerts = []
  const spending = {}
  transactions
    .filter((t) => t.type === 'expense' && t.month === month && t.year === year)
    .forEach((t) => {
      spending[t.category] = (spending[t.category] || 0) + t.amount
    })

  Object.entries(budgetLimits).forEach(([catId, limit]) => {
    const spent = spending[catId] || 0
    const pct = (spent / limit) * 100
    if (pct >= 80) {
      alerts.push({ catId, spent, limit, pct: Math.round(pct), exceeded: pct >= 100 })
    }
  })
  return alerts
}

// ── Color helpers ─────────────────────────────────────────────
export function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
