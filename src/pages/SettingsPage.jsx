// ============================================================
// src/pages/SettingsPage.jsx
// App settings: categories, budget limits, theme, export.
// ============================================================

import React, { useState } from 'react'
import { Plus, Trash2, Moon, Sun, Download, AlertCircle } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import TopBar from '../components/layout/TopBar'
import useStore, { DEFAULT_CATEGORIES } from '../store/useStore'
import { addCategory, deleteCategory } from '../services/transactionService'
import { exportToCSV, formatCurrency } from '../utils/helpers'

const EMOJI_OPTIONS = ['🍕','🚗','⚡','🛒','🏥','🎮','📚','✈️','💼','📈','💻','🎁','💰','🏠','🎬','🎵','🏋️','🌐','📱','🎯']

export default function SettingsPage() {
  const {
    user, darkMode, toggleDarkMode,
    customCategories, addCustomCategory, removeCustomCategory,
    budgetLimits, setBudgetLimit, removeBudgetLimit,
    getAllCategories, transactions,
  } = useStore()

  const allCategories = getAllCategories()

  // ── New category form ──────────────────────────────────────
  const [newCat, setNewCat] = useState({ name: '', icon: '💸', color: '#6366f1', type: 'expense' })
  const [addingCat, setAddingCat] = useState(false)
  const [catError, setCatError] = useState('')

  const handleAddCategory = async () => {
    if (!newCat.name.trim()) { setCatError('Name is required'); return }
    if (!user) return
    const cat = {
      id:    `custom_${Date.now()}`,
      name:  newCat.name.trim(),
      icon:  newCat.icon,
      color: newCat.color,
      type:  newCat.type,
    }
    setAddingCat(true)
    try {
      const saved = await addCategory(user.uid, cat)
      addCustomCategory(saved)
      setNewCat({ name: '', icon: '💸', color: '#6366f1', type: 'expense' })
      setCatError('')
    } catch (e) {
      setCatError(e.message)
    } finally {
      setAddingCat(false)
    }
  }

  const handleDeleteCat = async (catId) => {
    if (!user) return
    if (!window.confirm('Delete this category?')) return
    await deleteCategory(user.uid, catId)
    removeCustomCategory(catId)
  }

  // ── Budget limits ──────────────────────────────────────────
  const [budgetForm, setBudgetForm] = useState({})

  const expenseCategories = allCategories.filter((c) => c.type === 'expense')

  const handleSetBudget = (catId) => {
    const val = budgetForm[catId]
    if (!val || isNaN(val) || +val <= 0) return
    setBudgetLimit(catId, val)
    setBudgetForm((f) => ({ ...f, [catId]: '' }))
  }

  // ── Export ─────────────────────────────────────────────────
  const handleExport = () => exportToCSV(transactions, allCategories)

  return (
    <AppLayout>
      <TopBar title="Settings" />

      <div className="flex-1 p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full">

        {/* ── Appearance ─────────────────────────────────── */}
        <Section title="Appearance">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Dark Mode</p>
              <p className="text-xs text-surface-400 mt-0.5">Switch between light and dark theme</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                darkMode ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span className={`inline-block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 mt-0.5 ${
                darkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </Section>

        {/* ── Categories ─────────────────────────────────── */}
        <Section title="Categories">
          {/* Default categories (read-only) */}
          <div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
              Default ({DEFAULT_CATEGORIES.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_CATEGORIES.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span
                    className="w-2 h-2 rounded-full ml-0.5"
                    style={{ backgroundColor: cat.color }}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Custom categories */}
          {customCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Custom ({customCategories.length})
              </p>
              <div className="space-y-2">
                {customCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm text-surface-700 dark:text-surface-300 flex-1">{cat.name}</span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      cat.type === 'expense'
                        ? 'bg-danger-50 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'
                        : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                    }`}>
                      {cat.type}
                    </span>
                    <button
                      onClick={() => handleDeleteCat(cat.id)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new category form */}
          <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700 space-y-3">
            <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Add Custom Category
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCat.name}
                  onChange={(e) => setNewCat((f) => ({ ...f, name: e.target.value }))}
                  className="input-base text-sm"
                />
                {catError && <p className="text-xs text-danger-500 mt-1">{catError}</p>}
              </div>

              <select
                value={newCat.type}
                onChange={(e) => setNewCat((f) => ({ ...f, type: e.target.value }))}
                className="input-base text-sm"
              >
                <option value="expense">Expense</option>
                <option value="saving">Saving</option>
              </select>

              <div className="flex items-center gap-2">
                <label className="text-xs text-surface-500">Color</label>
                <input
                  type="color"
                  value={newCat.color}
                  onChange={(e) => setNewCat((f) => ({ ...f, color: e.target.value }))}
                  className="w-8 h-8 rounded-lg border border-surface-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Emoji picker */}
            <div>
              <p className="text-xs text-surface-500 mb-1.5">Icon</p>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewCat((f) => ({ ...f, icon: emoji }))}
                    className={`w-9 h-9 rounded-xl text-lg transition-all ${
                      newCat.icon === emoji
                        ? 'bg-brand-100 dark:bg-brand-900/40 ring-2 ring-brand-400'
                        : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddCategory}
              disabled={addingCat}
              className="btn-primary py-2 px-4 text-sm"
            >
              <Plus className="w-4 h-4" />
              {addingCat ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </Section>

        {/* ── Budget Limits ───────────────────────────────── */}
        <Section title="Budget Limits" subtitle="Set monthly spending limits per category. Get alerted at 80% and 100%.">
          <div className="space-y-2">
            {expenseCategories.map((cat) => {
              const current = budgetLimits[cat.id]
              return (
                <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
                  <span className="text-lg w-8 text-center flex-shrink-0">{cat.icon}</span>
                  <span className="text-sm text-surface-700 dark:text-surface-300 flex-1 truncate">{cat.name}</span>

                  {current ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                        {formatCurrency(current)}/mo
                      </span>
                      <button
                        onClick={() => removeBudgetLimit(cat.id)}
                        className="p-1 rounded-lg text-surface-400 hover:text-danger-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder="Amount"
                        min="0"
                        value={budgetForm[cat.id] || ''}
                        onChange={(e) => setBudgetForm((f) => ({ ...f, [cat.id]: e.target.value }))}
                        className="input-base py-1.5 w-24 text-sm font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && handleSetBudget(cat.id)}
                      />
                      <button
                        onClick={() => handleSetBudget(cat.id)}
                        className="btn-primary py-1.5 px-3 text-xs"
                      >
                        Set
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Section>

        {/* ── Data & Export ───────────────────────────────── */}
        <Section title="Data & Export">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
            <div>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Export Transactions</p>
              <p className="text-xs text-surface-400 mt-0.5">
                Download all {transactions.length} transactions as CSV
              </p>
            </div>
            <button onClick={handleExport} className="btn-secondary text-sm gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Account info */}
          {user && (
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Account</p>
              <p className="text-xs text-surface-500 mt-1">{user.email}</p>
              <p className="text-xs text-surface-400 mt-0.5">UID: {user.uid}</p>
            </div>
          )}
        </Section>
      </div>
    </AppLayout>
  )
}

// ── Reusable section wrapper ─────────────────────────────────
function Section({ title, subtitle, children }) {
  return (
    <div className="card p-5 space-y-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="border-t border-surface-100 dark:border-surface-800 pt-4">
        {children}
      </div>
    </div>
  )
}
