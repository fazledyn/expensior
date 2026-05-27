# Expensior — Claude Instructions

## What this is
A personal expense tracker PWA built with React 18 + Vite. Mobile-first (max-width 430px), designed to feel like a native iOS app in the browser. No backend — all data lives in `localStorage`.

## Stack
- React 18, Vite 5
- No UI library (plain inline styles)
- `localStorage` via the `src/storage.js` wrapper
- `nanoid` for ID generation

## Architecture
```
src/
  App.jsx              — tab shell (Home, Transactions, Budget, Summary, Settings)
  constants.js         — STORAGE_KEYS, DEFAULT_SOURCES
  theme.js             — COLORS
  utils.js             — date helpers + generateId
  storage.js           — loadData / saveData (localStorage wrapper)
  context/
    AppContext.jsx      — global state + all persist* mutations
  screens/             — one file per tab
  components/          — MonthSelector, ProgressBar, Modal
public/
  manifest.json        — PWA manifest
  sw.js                — service worker
```

Global state lives in `AppContext`. Every mutation goes through a `persist*` function that updates both React state and localStorage atomically. Never write to localStorage directly outside `storage.js`.

## Storage keys
| Key | Shape | Notes |
|---|---|---|
| `categories` | `{ id, name, limit }[]` | Monthly budget categories |
| `sources` | `{ id, name }[]` | Payment sources (cards, accounts) |
| `transactions` | `{ id, month, amount, categoryId, sourceId, note }[]` | Expense entries |
| `income` | `{ id, month, amount, note }[]` | Income entries (paychecks); multiple per month |

## Service worker strategy
- `/assets/*` — cache-first (Vite content-hashes these filenames, so they're immutable)
- Everything else (`index.html`, icons, manifest) — network-first with offline fallback

This means deploys are picked up automatically on next open with network access. No cache version bumping needed.

## Code conventions
- camelCase for variables and functions, PascalCase for components
- UPPERCASE for constants (e.g. `COLORS`, `STORAGE_KEYS`)
- Inline styles only — no CSS modules, no Tailwind
- Minimal comments — only where logic is non-obvious
- Config as JSON/JS objects, not environment variables

## Dev
```
npm install
npm run dev      # localhost:5173
npm run build
npm run preview
```

## Future considerations
- Cloudflare D1 (serverless SQLite) + Workers as an optional backend when cloud sync is needed. The `storage.js` abstraction is intentionally kept thin so this swap is localized.
