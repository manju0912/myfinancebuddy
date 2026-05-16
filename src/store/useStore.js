// ============================================================
// src/store/useStore.js
// Zustand global store — auth, transactions, categories, UI.
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Default categories ────────────────────────────────────────
export const DEFAULT_CATEGORIES = [
  { id: 'food',        name: 'Food & Dining',   icon: '🍔', color: '#f97316', type: 'expense' },
  { id: 'transport',   name: 'Transport',        icon: '🚌', color: '#3b82f6', type: 'expense' },
  { id: 'bills',       name: 'Bills & Utilities',icon: '⚡', color: '#a855f7', type: 'expense' },
  { id: 'shopping',    name: 'Shopping',         icon: '🛍️', color: '#ec4899', type: 'expense' },
  { id: 'health',      name: 'Health',           icon: '🏥', color: '#14b8a6', type: 'expense' },
  { id: 'entertainment',name: 'Entertainment',   icon: '🎬', color: '#f59e0b', type: 'expense' },
  { id: 'education',   name: 'Education',        icon: '📚', color: '#6366f1', type: 'expense' },
  { id: 'travel',      name: 'Travel',           icon: '✈️', color: '#0ea5e9', type: 'expense' },
  { id: 'other_exp',   name: 'Other',            icon: '💸', color: '#94a3b8', type: 'expense' },
  { id: 'salary',      name: 'Salary',           icon: '💼', color: '#22c55e', type: 'income' },
  { id: 'freelance',   name: 'Freelance',        icon: '💻', color: '#84cc16', type: 'income' },
  { id: 'gift',        name: 'Gift / Bonus',     icon: '🎁', color: '#34d399', type: 'income' },
  { id: 'other_sav',   name: 'Other Income',     icon: '💰', color: '#4ade80', type: 'income' },
  { id: 'investment',  name: 'Investment',       icon: '📈', color: '#10b981', type: 'saving' },
  { id: 'fixed_deposit',name: 'Fixed Deposit',   icon: '🏦', color: '#06b6d4', type: 'saving' },
  { id: 'mutual_fund', name: 'Mutual Fund',      icon: '📊', color: '#0f766e', type: 'saving' },
  { id: 'other_saving',name: 'Other Saving',     icon: '🎯', color: '#14b8a6', type: 'saving' },
]

const useStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────
      user: null,
      setUser: (user) => set({ user }),

      // ── Transactions ──────────────────────────────────────
      transactions: [],
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (tx) =>
        set((s) => ({ transactions: [tx, ...s.transactions] })),
      updateTransaction: (id, data) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),
      removeTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      // ── Categories ────────────────────────────────────────
      customCategories: [],
      setCustomCategories: (cats) => set({ customCategories: cats }),
      addCustomCategory: (cat) =>
        set((s) => ({ customCategories: [...s.customCategories, cat] })),
      removeCustomCategory: (id) =>
        set((s) => ({
          customCategories: s.customCategories.filter((c) => c.id !== id),
        })),

      // All categories (default + custom merged)
      getAllCategories: () => {
        const { customCategories } = get()
        return [...DEFAULT_CATEGORIES, ...customCategories]
      },

      // ── Budget Limits ─────────────────────────────────────
      budgetLimits: {},   // { categoryId: amount }
      setBudgetLimit: (catId, amount) =>
        set((s) => ({
          budgetLimits: { ...s.budgetLimits, [catId]: parseFloat(amount) },
        })),
      removeBudgetLimit: (catId) =>
        set((s) => {
          const { [catId]: _, ...rest } = s.budgetLimits
          return { budgetLimits: rest }
        }),

      // ── UI State ──────────────────────────────────────────
      darkMode: false,
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode
          if (next) document.documentElement.classList.add('dark')
          else document.documentElement.classList.remove('dark')
          return { darkMode: next }
        }),

      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      // Loading / error
      loading: false,
      setLoading: (loading) => set({ loading }),
      error: null,
      setError: (error) => set({ error }),
    }),
    {
      name: 'flowtrack-store',
      // Only persist these keys to localStorage
      partialize: (s) => ({
        darkMode:         s.darkMode,
        customCategories: s.customCategories,
        budgetLimits:     s.budgetLimits,
      }),
    }
  )
)

export default useStore
