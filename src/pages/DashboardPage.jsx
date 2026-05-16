// ============================================================
// src/pages/DashboardPage.jsx
// Main dashboard: stat cards, insight, recent transactions.
// ============================================================

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import TopBar from '../components/layout/TopBar'
import StatCard from '../components/ui/StatCard'
import MonthlyInsight from '../components/ui/MonthlyInsight'
import BudgetAlerts from '../components/ui/BudgetAlerts'
import TransactionList from '../components/transactions/TransactionList'
import TransactionModal from '../components/transactions/TransactionModal'
import { useTransactions } from '../hooks/useTransactions'
import { MonthlyBarChart } from '../components/charts/Charts'
import { buildMonthlyData } from '../utils/helpers'
import useStore from '../store/useStore'

export default function DashboardPage() {
  const { transactions, totals, monthlyComparison, create, update, remove } = useTransactions()
  const { getAllCategories } = useStore()
  const categories = getAllCategories()

  const [modalOpen, setModalOpen] = useState(false)
  const [editData,  setEditData]  = useState(null)

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

  const monthlyData = buildMonthlyData(transactions, categories)
  const recent = transactions.slice(0, 8)

  return (
    <AppLayout>
      <TopBar title="Dashboard" onAddTransaction={openAdd} />

      <div className="flex-1 p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">

        {/* Budget alerts */}
        <BudgetAlerts />

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            type="balance"
            amount={totals.balance}
            subtitle={`${transactions.length} total transactions`}
          />
          <StatCard
            type="expenses"
            amount={totals.expenses}
            percentChange={parseFloat(monthlyComparison.percentChange)}
          />
          <StatCard
            type="savings"
            amount={totals.savings}
          />
        </div>

        {/* Insight */}
        <MonthlyInsight monthlyComparison={monthlyComparison} />

        {/* Monthly overview chart */}
        <div className="card p-5">
          <h2 className="section-title mb-4">Monthly Cash Flow</h2>
          <MonthlyBarChart data={monthlyData} />
        </div>

        {/* Recent transactions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Transactions</h2>
            <button onClick={openAdd} className="btn-primary py-2 px-3 text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <TransactionList
            transactions={recent}
            onEdit={openEdit}
            onDelete={handleDelete}
            showFilters={false}
          />
        </div>
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
