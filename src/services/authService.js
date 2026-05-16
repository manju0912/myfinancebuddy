// ============================================================
// src/services/authService.js
// Firebase Auth helpers: signup, login, logout, Google OAuth.
// ============================================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

/** Sign up with email & password + set display name */
export async function signUp(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(cred.user, { displayName })
  }
  return cred.user
}

/** Sign in with email & password */
export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

/** Google sign-in popup */
export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider)
  return cred.user
}

/** Sign out */
export async function logOut() {
  await signOut(auth)
}

/** Send password reset email */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}
