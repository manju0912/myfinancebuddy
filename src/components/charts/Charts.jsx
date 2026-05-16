// ============================================================
// src/components/charts/Charts.jsx
// Three Recharts-based charts: Pie, Bar, Line.
// Each accepts pre-computed data from helpers.js.
// ============================================================

import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart,
} from 'recharts'
import { formatCurrency } from '../../utils/helpers'

// ── Shared tooltip style ────────────────────────────────────
const TooltipBox = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-3 shadow-lg text-sm">
      {label && <p className="font-semibold text-surface-700 dark:text-surface-300 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

// ── Pie Chart (category-wise) ────────────────────────────────
export function CategoryPieChart({ data }) {
  if (!data?.length) return <EmptyChart />

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => (
            <TooltipBox
              active={active}
              payload={payload}
              formatter={(v) => formatCurrency(v)}
            />
          )}
        />
        <Legend
          formatter={(value) => (
            <span className="text-xs font-medium text-surface-600 dark:text-surface-400">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ── Bar Chart (monthly income, expenses, and savings) ────────
export function MonthlyBarChart({ data }) {
  if (!data?.length) return <EmptyChart />

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barCategoryGap="30%" barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-surface-800" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'currentColor', className: 'text-surface-400' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <TooltipBox active={active} payload={payload} label={label} formatter={(v) => formatCurrency(v)} />
          )}
        />
        <Legend
          formatter={(value) => (
            <span className="text-xs font-medium capitalize">{value}</span>
          )}
        />
        <Bar dataKey="income"   name="Account Balance" fill="#22c55e" radius={[6, 6, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses"        fill="#f43f5e" radius={[6, 6, 0, 0]} />
        <Bar dataKey="savings"  name="Savings"         fill="#06b6d4" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Line/Area Chart (trend over time) ───────────────────────
export function TrendLineChart({ data }) {
  if (!data?.length) return <EmptyChart />

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradSav" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-surface-800" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <TooltipBox active={active} payload={payload} label={label} formatter={(v) => formatCurrency(v)} />
          )}
        />
        <Legend />
        <Area type="monotone" dataKey="balance"  name="Balance"  stroke="#22c55e" fill="url(#gradBalance)" strokeWidth={2} dot={false} />
        <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fill="url(#gradExp)"     strokeWidth={2} dot={false} />
        <Area type="monotone" dataKey="savings"  name="Savings"  stroke="#06b6d4" fill="url(#gradSav)"     strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── Empty state ──────────────────────────────────────────────
function EmptyChart() {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-surface-300 dark:text-surface-700">
      <p className="text-4xl mb-2">📊</p>
      <p className="text-sm font-medium">No data yet</p>
      <p className="text-xs mt-1">Add transactions to see charts</p>
    </div>
  )
}
