# 🌊 FlowTrack — Expense & Savings Tracker

A modern, full-stack personal finance tracker built with React + Firebase.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?logo=firebase)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-2-22C55E)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Auth | Email/password + Google OAuth via Firebase Auth |
| 📊 Dashboard | Balance, expenses, savings cards + monthly bar chart + insights |
| ➕ Transactions | Add / edit / delete with category, date, notes |
| 📂 Categories | 14 default + unlimited custom categories with emoji & color |
| 📈 Analytics | Pie (category), Bar (monthly), Line (trend) charts with filters |
| 🚨 Budget Alerts | Per-category monthly limits with 80%/100% alerts |
| 🌓 Dark Mode | System-aware toggle, persisted to localStorage |
| 📤 CSV Export | One-click export of filtered transactions |
| 📱 Responsive | Mobile-first, sidebar collapses on small screens |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/you/flowtrack.git
cd flowtrack
npm install
```

### 2. Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in methods → Email/Password + Google
4. Enable **Firestore Database** → Start in production mode
5. Copy your web app config

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env and paste your Firebase credentials
```

### 4. Apply Firestore Security Rules

Copy the contents of `firestore.rules` into:
Firebase Console → Firestore → Rules → Edit

### 5. Run Dev Server

```bash
npm run dev
# Opens at http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.jsx      # Auth guard for private routes
│   ├── charts/
│   │   └── Charts.jsx              # PieChart, BarChart, LineChart (Recharts)
│   ├── layout/
│   │   ├── AppLayout.jsx           # Main layout wrapper
│   │   ├── Sidebar.jsx             # Collapsible nav sidebar
│   │   └── TopBar.jsx              # Header with toggles
│   ├── transactions/
│   │   ├── TransactionList.jsx     # List view with edit/delete
│   │   └── TransactionModal.jsx    # Add/edit modal form
│   └── ui/
│       ├── BudgetAlerts.jsx        # Overspending alert banners
│       ├── MonthlyInsight.jsx      # "Spent X% more/less" insight
│       └── StatCard.jsx            # Summary KPI cards
├── hooks/
│   ├── useAuth.js                  # Firebase auth state listener
│   └── useTransactions.js          # CRUD + computed selectors
├── pages/
│   ├── AuthPage.jsx                # Login / Signup
│   ├── DashboardPage.jsx           # Main dashboard
│   ├── AnalyticsPage.jsx           # Charts + filters
│   ├── TransactionsPage.jsx        # Full transaction manager
│   └── SettingsPage.jsx            # Categories, budgets, export
├── services/
│   ├── authService.js              # Firebase Auth helpers
│   ├── firebase.js                 # Firebase app init
│   └── transactionService.js       # Firestore CRUD
├── store/
│   └── useStore.js                 # Zustand global state
└── utils/
    └── helpers.js                  # formatCurrency, chart builders, CSV export
```

---

## 🗄️ Data Model

Each transaction is stored at: `users/{userId}/transactions/{txId}`

```json
{
  "id":        "auto-generated",
  "userId":    "firebase_uid",
  "type":      "expense | saving",
  "amount":    150.00,
  "category":  "food",
  "date":      "2025-01-15",
  "month":     1,
  "year":      2025,
  "monthName": "January",
  "notes":     "Grocery run",
  "createdAt": "server timestamp"
}
```

---

## 🌐 Deployment (Vercel)

```bash
npm run build          # builds to dist/
vercel --prod          # deploys (install vercel CLI first)
```

Add your `VITE_FIREBASE_*` environment variables in Vercel dashboard under **Settings → Environment Variables**.

---

## 🔧 Customization Tips

### Adding more categories
Edit `DEFAULT_CATEGORIES` in `src/store/useStore.js` or use the Settings page at runtime.

### Changing currency
Find `formatCurrency` in `src/utils/helpers.js` and change `'USD'` to your currency code (e.g. `'INR'`, `'EUR'`).

### Swapping Firestore for Supabase
Replace `src/services/firebase.js` and `src/services/transactionService.js` with Supabase equivalents — the store and hooks stay the same.

---

## 🛣️ Roadmap / Improvements

- [ ] Recurring transactions (weekly/monthly auto-entries)
- [ ] Multi-currency support
- [ ] Shared household budgets (multi-user)
- [ ] PWA / offline support
- [ ] PDF report generation
- [ ] Bank import (CSV/OFX)
- [ ] AI-powered spending insights

---

## 📄 License

MIT © 2025
