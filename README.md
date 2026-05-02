# Spendyn

A personal expense tracker PWA. Tracks transactions by month, category, and payment source. Works offline — data is stored locally in the browser.

## Features
- Add and delete transactions with amount, category, source, and note
- Monthly budget limits per category with progress tracking
- Monthly summary and spending breakdown
- Manage custom categories and payment sources

## Tech
React 18 + Vite. No backend, no accounts — `localStorage` only.

## Run locally
```
npm install
npm run dev
```

Open `http://localhost:5173` in your browser (or on mobile via your local network IP).

## Deploy (Cloudflare Pages)

1. Push this repo to GitHub
2. Go to Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select this repo and set:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**

Every push to `master` deploys automatically after setup.
