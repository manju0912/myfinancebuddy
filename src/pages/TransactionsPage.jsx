// ============================================================
// src/pages/TransactionsPage.jsx
// Full transaction management: filter, search, edit, delete.
// ============================================================

import React, { useState, useMemo } from 'react'
import { Plus, Download } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import TopBar from '../components/layout/TopBar'
import TransactionList from '../components/transactions/TransactionList'
import TransactionModal from '../components/transactions/TransactionModal'
import { useTransactions } from '../hooks/useTransactions'
import useStore from '../store/useStore'
import { calculateTotals, exportToCSV, formatCurrency, getTransactionType, TRANSACTION_TYPES } from '../utils/helpers'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

export default function TransactionsPage() {
  const { getAllCategories } = useStore()
  const categories = getAllCategories()
  const { transactions, create, update, remove } = useTransactions()

  const [modalOpen, setModalOpen] = useState(false)
  const [editData,  setEditData]  = useState(null)

  // Filters
  const [filterMonth, setFilterMonth] = useState(0)
  const [filterYear,  setFilterYear]  = useState(CURRENT_YEAR)
  const [filterType,  setFilterType]  = useState('all')
  const [filterCat,   setFilterCat]   = useState('all')
  const [search,      setSearch]      = useState('')

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterMonth && tx.month !== filterMonth)     return false
      if (filterYear  && tx.year  !== filterYear)      return false
      if (filterType !== 'all' && getTransactionType(tx, categories) !== filterType) return false
      if (filterCat  !== 'all' && tx.category !== filterCat) return false
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
  }, [transactions, filterMonth, filterYear, filterType, filterCat, search, categories])

  // Totals for filtered set
  const filteredTotals = useMemo(() => calculateTotals(filtered, categories), [filtered, categories])

  const openAdd  = () => { setEditData(null); setModalOpen(true) }
  const openEdit = (tx) => { setEditData(tx); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditData(null) }

  const handleSubmit = async (form) => {
    if (editData) await update(editData.id, form)
    else          await create(form)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) await remove(id)
  }

  const handleExport = () => exportToCSV(filtered, categories)

  const resetFilters = () => {
    setFilterMonth(0); setFilterYear(CURRENT_YEAR)
    setFilterType('all'); setFilterCat('all'); setSearch('')
  }

  return (
    <AppLayout>
      <TopBar title="Transactions" onAddTransaction={openAdd} />

      <div className="flex-1 p-4 md:p-6 space-y-5 max-w-5xl mx-auto w-full">

        {/* Summary strip */}
        <div className="flex flex-wrap items-center gap-3 p-4 card">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} shown
            </p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs font-mono text-brand-600">
                +{formatCurrency(filteredTotals.income)}
              </span>
              <span className="text-xs font-mono text-danger-500">
                −{formatCurrency(filteredTotals.expenses)}
              </span>
              <span className="text-xs font-mono text-cyan-600">
                −{formatCurrency(filteredTotals.savings)}
              </span>
              <span className="text-xs font-mono font-semibold text-surface-700 dark:text-surface-300">
                Balance: {formatCurrency(filteredTotals.balance)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="btn-secondary py-2 px-3 text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button onClick={openAdd} className="btn-primary py-2 px-3 text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="card p-4">
          <div className="flex flex-wrap gap-2 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-medium text-surface-500 mb-1">Search</label>
              <input
                type="text"
                placeholder="Category, notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base py-2 text-sm"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-surface-500 mb-1">Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-base py-2 text-sm w-auto">
                <option value="all">All</option>
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block text-xs font-medium text-surface-500 mb-1">Month</label>
              <select value={filterMonth} onChange={(e) => setFilterMonth(+e.target.value)} className="input-base py-2 text-sm w-auto">
                <option value={0}>All</option>
                {MONTHS.map((m, i) => <option key={m} value={i+1}>{m.slice(0,3)}</option>)}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-medium text-surface-500 mb-1">Year</label>
              <select value={filterYear} onChange={(e) => setFilterYear(+e.target.value)} className="input-base py-2 text-sm w-auto">
                <option value={0}>All</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Category */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-surface-500 mb-1">Category</label>
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input-base py-2 text-sm">
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>

            {/* Reset */}
            <button onClick={resetFilters} className="btn-secondary py-2 px-3 text-xs">
              Reset
            </button>
          </div>
        </div>

        {/* Transaction list — no internal filters since we handle them here */}
        <TransactionList
          transactions={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
          showFilters={false}
        />
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </AppLayout>
  )
}
