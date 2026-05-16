// ============================================================
// src/components/transactions/TransactionModal.jsx
// Modal for adding / editing a transaction.
// ============================================================

import React, { useState, useEffect } from 'react'
import { X, DollarSign, Tag, Calendar, FileText, Check } from 'lucide-react'
import useStore, { DEFAULT_CATEGORIES } from '../../store/useStore'
import { todayISO } from '../../utils/helpers'

const INIT = {
  type:     'expense',
  amount:   '',
  category: '',
  date:     todayISO(),
  notes:    '',
}

export default function TransactionModal({ open, onClose, onSubmit, editData }) {
  const { getAllCategories } = useStore()
  const allCategories = getAllCategories()

  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill when editing
  useEffect(() => {
    if (editData) setForm({ ...INIT, ...editData })
    else setForm(INIT)
    setErrors({})
  }, [editData, open])

  const filteredCats = allCategories.filter((c) => c.type === form.type)

  const set = (field, val) => {
    setForm((f) => {
      const next = { ...f, [field]: val }
      // Reset category if type changed
      if (field === 'type') next.category = ''
      return next
    })
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0)
      e.amount = 'Enter a valid positive amount'
    if (!form.category)
      e.category = 'Please select a category'
    if (!form.date)
      e.date = 'Date is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-surface-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-surface-100 dark:border-surface-800 animate-slide-up">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-surface-200 dark:bg-surface-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">
            {editData ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 p-1 bg-surface-50 dark:bg-surface-800">
            {['expense', 'saving'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className={`
                  flex-1 py-2 rounded-lg text-sm font-semibold font-display capitalize transition-all
                  ${form.type === t
                    ? t === 'expense'
                      ? 'bg-danger-500 text-white shadow-sm'
                      : 'bg-brand-500 text-white shadow-sm'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                  }
                `}
              >
                {t === 'expense' ? '💸 Expense' : '💰 Saving'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1.5 uppercase tracking-wide">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                className={`input-base pl-9 font-mono ${errors.amount ? 'border-danger-400 focus:ring-danger-400' : ''}`}
              />
            </div>
            {errors.amount && <p className="text-xs text-danger-500 mt-1">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1.5 uppercase tracking-wide">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {filteredCats.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => set('category', cat.id)}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all
                    ${form.category === cat.id
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                      : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
                    }
                  `}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-center leading-tight line-clamp-2">{cat.name}</span>
                  {form.category === cat.id && (
                    <Check className="w-3 h-3 text-brand-500" />
                  )}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-xs text-danger-500 mt-1">{errors.category}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1.5 uppercase tracking-wide">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={`input-base pl-9 ${errors.date ? 'border-danger-400' : ''}`}
              />
            </div>
            {errors.date && <p className="text-xs text-danger-500 mt-1">{errors.date}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1.5 uppercase tracking-wide">
              Notes <span className="normal-case font-normal">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-surface-400" />
              <textarea
                rows={2}
                placeholder="Add a note..."
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                className="input-base pl-9 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                editData ? 'Save Changes' : 'Add Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
