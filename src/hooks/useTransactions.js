// ============================================================
// src/hooks/useTransactions.js
// Computed selectors and CRUD helpers over the store.
// ============================================================

import { useMemo } from 'react'
import useStore from '../store/useStore'
import {
  addTransaction as addTxSvc,
  updateTransaction as updateTxSvc,
  deleteTransaction as deleteTxSvc,
} from '../services/transactionService'

/**
 * Provides transaction data + helpers.
 *
 * @param {Object} filters  — { month, year, category, type, search }
 */
export function useTransactions(filters = {}) {
  const {
    user,
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    setLoading,
    setError,
  } = useStore()

  // ── Filtered list ────────────────────────────────────────
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.month    && tx.month    !== filters.month)    return false
      if (filters.year     && tx.year     !== filters.year)     return false
      if (filters.category && tx.category !== filters.category) return false
      if (filters.type     && tx.type     !== filters.type)     return false
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (
          !tx.category?.toLowerCase().includes(s) &&
          !tx.notes?.toLowerCase().includes(s)
        ) return false
      }
      return true
    })
  }, [transactions, filters])

  // ── Aggregates ───────────────────────────────────────────
  const totals = useMemo(() => {
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0)
    const savings = transactions
      .filter((t) => t.type === 'saving')
      .reduce((s, t) => s + t.amount, 0)
    return {
      expenses,
      savings,
      balance: savings - expenses,
    }
  }, [transactions])

  // ── Monthly comparison (current vs previous month) ───────
  const monthlyComparison = useMemo(() => {
    const now = new Date()
    const curMonth = now.getMonth() + 1
    const curYear  = now.getFullYear()
    const prevMonth = curMonth === 1 ? 12 : curMonth - 1
    const prevYear  = curMonth === 1 ? curYear - 1 : curYear

    const sum = (m, y, type) =>
      transactions
        .filter((t) => t.month === m && t.year === y && t.type === type)
        .reduce((s, t) => s + t.amount, 0)

    const curExp  = sum(curMonth,  curYear,  'expense')
    const prevExp = sum(prevMonth, prevYear, 'expense')
    const pct = prevExp === 0 ? 0 : ((curExp - prevExp) / prevExp) * 100

    return { curExp, prevExp, percentChange: pct.toFixed(1) }
  }, [transactions])

  // ── CRUD ─────────────────────────────────────────────────
  const create = async (data) => {
    if (!user) return
    setLoading(true)
    try {
      const tx = await addTxSvc(user.uid, data)
      addTransaction(tx)
      return tx
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const update = async (id, data) => {
    if (!user) return
    setLoading(true)
    try {
      const tx = await updateTxSvc(user.uid, id, data)
      updateTransaction(id, tx)
      return tx
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!user) return
    setLoading(true)
    try {
      await deleteTxSvc(user.uid, id)
      removeTransaction(id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { transactions, filtered, totals, monthlyComparison, create, update, remove }
}
