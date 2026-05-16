// ============================================================
// src/hooks/useAuth.js
// Firebase auth listener — syncs user into Zustand store.
// ============================================================

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import useStore from '../store/useStore'
import { fetchTransactions, fetchCategories } from '../services/transactionService'

/**
 * useAuth — subscribe to Firebase auth state changes.
 * When a user logs in, fetch their data.
 * When they log out, clear the store.
 */
export function useAuth() {
  const { setUser, setTransactions, setCustomCategories, setLoading, darkMode } = useStore()

  useEffect(() => {
    // Apply saved dark-mode preference on mount
    if (darkMode) document.documentElement.classList.add('dark')

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid:         firebaseUser.uid,
          email:       firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL:    firebaseUser.photoURL,
        })
        setLoading(true)
        try {
          const [txs, cats] = await Promise.all([
            fetchTransactions(firebaseUser.uid),
            fetchCategories(firebaseUser.uid),
          ])
          setTransactions(txs)
          setCustomCategories(cats)
        } catch (err) {
          console.error('Error loading user data:', err)
        } finally {
          setLoading(false)
        }
      } else {
        // Logged out — clear user data
        setUser(null)
        setTransactions([])
        setCustomCategories([])
      }
    })

    return () => unsubscribe()
  }, [])
}
