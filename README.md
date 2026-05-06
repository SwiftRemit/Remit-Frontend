# ⚡ SwiftRemit — Frontend

React + TypeScript + Tailwind CSS frontend for the SwiftRemit cross-border payment platform.

## Tech Stack

- **React 18** + **TypeScript 5**
- **Vite 5** — build tool
- **Tailwind CSS 3** — styling
- **Zustand** — state management (auth + wallet)
- **Axios** — HTTP client with JWT interceptor
- **React Router v6** — client-side routing
- **React Hot Toast** — notifications
- **Freighter API** — Stellar browser wallet integration

## Project Structure

```
src/
├── api/              # Auth, wallet, payment, transaction API calls
├── components/
│   ├── layout/       # Navbar, Sidebar, Layout wrapper
│   ├── MoneyTransferAnimation.tsx
│   └── TypewriterText.tsx
├── hooks/            # useFreighter, useInView
├── pages/            # Landing, Login, Register, Dashboard, Send, Transactions, Wallet
└── store/            # Zustand auth + wallet stores
```

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
```

## Environment

Vite proxies `/api` requests to `http://localhost:5000` in development.
No `.env` file needed for the frontend — configure the backend separately.

## GitHub

[https://github.com/SwiftRemit/Remit-Frontend](https://github.com/SwiftRemit/Remit-Frontend)
