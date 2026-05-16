// ============================================================
// src/services/transactionService.js
// All Firestore operations for transactions & categories.
// ============================================================

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { v4 as uuidv4 } from 'uuid'
import { format, getMonth, getYear } from 'date-fns'

// ── Collection references ────────────────────────────────────
const txCol = (userId) => collection(db, 'users', userId, 'transactions')
const catCol = (userId) => collection(db, 'users', userId, 'categories')

// ============================================================
// TRANSACTIONS
// ============================================================

/**
 * Fetch all transactions for a user, ordered by date desc.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function fetchTransactions(userId) {
  const q = query(txCol(userId), orderBy('date', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Add a new transaction.
 * @param {string} userId
 * @param {Object} data  — { type, amount, category, date, notes }
 * @returns {Promise<Object>} created transaction
 */
export async function addTransaction(userId, data) {
  const dateObj = new Date(data.date)
  const payload = {
    ...data,
    userId,
    amount:    parseFloat(data.amount),
    month:     getMonth(dateObj) + 1,          // 1-indexed
    year:      getYear(dateObj),
    monthName: format(dateObj, 'MMMM'),
    createdAt: serverTimestamp(),
  }
  const ref = await addDoc(txCol(userId), payload)
  return { id: ref.id, ...payload }
}

/**
 * Update an existing transaction.
 * @param {string} userId
 * @param {string} txId
 * @param {Object} data
 */
export async function updateTransaction(userId, txId, data) {
  const dateObj = new Date(data.date)
  const payload = {
    ...data,
    amount:    parseFloat(data.amount),
    month:     getMonth(dateObj) + 1,
    year:      getYear(dateObj),
    monthName: format(dateObj, 'MMMM'),
    updatedAt: serverTimestamp(),
  }
  await updateDoc(doc(db, 'users', userId, 'transactions', txId), payload)
  return { id: txId, ...payload }
}

/**
 * Delete a transaction by ID.
 */
export async function deleteTransaction(userId, txId) {
  await deleteDoc(doc(db, 'users', userId, 'transactions', txId))
}

// ============================================================
// CATEGORIES
// ============================================================

/** Fetch user's custom categories */
export async function fetchCategories(userId) {
  const snap = await getDocs(catCol(userId))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/** Add a custom category */
export async function addCategory(userId, category) {
  const ref = await addDoc(catCol(userId), { ...category, createdAt: serverTimestamp() })
  return { id: ref.id, ...category }
}

/** Delete a custom category */
export async function deleteCategory(userId, catId) {
  await deleteDoc(doc(db, 'users', userId, 'categories', catId))
}
