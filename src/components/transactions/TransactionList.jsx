// ============================================================
// src/components/transactions/TransactionList.jsx
// Renders a list/table of transactions with edit/delete.
// ============================================================

import React, { useState } from 'react'
import { Pencil, Trash2, Search, ChevronDown, SlidersHorizontal } from 'lucide-react'
import useStore from '../../store/useStore'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  showFilters = true,
  limit,
}) {
  const { getAllCategories } = useStore()
  const categories = getAllCategories()

  const [search, setSearch]   = useState('')
  const [typeFilter, setType] = useState('all')
  const [catFilter,  setCat]  = useState('all')
  const [showFilter, setShowFilter] = useState(false)

  // Apply local filters
  const filtered = transactions
    .filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false
      if (catFilter  !== 'all' && tx.category !== catFilter) return false
      if (search) {
        const s = search.toLowerCase()
        const cat = categories.find((c) => c.id === tx.category)
        if (
          !cat?.name.toLowerCase().includes(s) &&
          !(tx.notes || '').toLowerCase().includes(s)
        ) return false
      }
      return true
    })
    .slice(0, limit)

  const getCat = (id) => categories.find((c) => c.id === id)

  return (
    <div className="space-y-3">
      {showFilters && (
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-9 py-2"
            />
          </div>
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`btn-secondary py-2 px-3 gap-1.5 ${showFilter ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-300 text-brand-600' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Filter</span>
          </button>
        </div>
      )}

      {/* Filter row */}
      {showFilter && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700 animate-fade-in">
          <select
            value={typeFilter}
            onChange={(e) => setType(e.target.value)}
            className="input-base py-1.5 w-auto text-xs"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="saving">Savings</option>
          </select>
          <select
            value={catFilter}
            onChange={(e) => setCat(e.target.value)}
            className="input-base py-1.5 w-auto text-xs flex-1"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          {(typeFilter !== 'all' || catFilter !== 'all' || search) && (
            <button
              onClick={() => { setType('all'); setCat('all'); setSearch('') }}
              className="text-xs text-danger-500 hover:text-danger-600 px-2 py-1 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-surface-400 dark:text-surface-600">
          <p className="text-4xl mb-2">🔍</p>
          <p className="font-medium">No transactions found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => {
            const cat = getCat(tx.category)
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 hover:shadow-card transition-all duration-150 group"
              >
                {/* Category icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: (cat?.color || '#94a3b8') + '20' }}
                >
                  {cat?.icon || '💸'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-surface-800 dark:text-surface-200 truncate">
                    {cat?.name || tx.category}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-surface-400 dark:text-surface-500">
                      {formatDate(tx.date)}
                    </p>
                    {tx.notes && (
                      <p className="text-xs text-surface-400 dark:text-surface-500 truncate max-w-[140px]">
                        · {tx.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <span className={`font-mono font-semibold text-sm ${
                  tx.type === 'expense'
                    ? 'text-danger-500 dark:text-danger-400'
                    : 'text-brand-600 dark:text-brand-400'
                }`}>
                  {tx.type === 'expense' ? '−' : '+'}{formatCurrency(tx.amount)}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
