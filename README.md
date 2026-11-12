# ☕ JavaPrepTracker

A **personal placement-preparation dashboard and daily task tracker** for a Java DSA student.
Mobile-first, dark LeetCode-style UI, installable on Android as a PWA, and **100% offline** after
the first load.

> No backend. No login. No cloud. Every task, problem, concept and study session lives in
> IndexedDB on your device.

---

## ✨ Features

| Screen | What it does |
| --- | --- |
| **Home** | Streak card (flame + current/longest + 30-day heatmap + 1×/week streak freeze), today's progress ring with study time, horizontally-scrolling quick stats (Java DSA `142/170`, Phase/Month/Week, CS `DBMS ✓ OS ✓ CN ◐`, Projects `2/3`), Today's Java Focus card, task preview with inline checkboxes, tappable daily Java fact, settings sheet. |
| **Java DSA** | 142 pre-seeded real problems. Difficulty/target stats (Easy 45/50, Medium 80/100, Hard 17/20), current pattern, problems this week, avg solve time, collections-usage chips, searchable + filterable log (difficulty, pattern, status, collection, date range, sort by date/difficulty/time), expandable notes, Add/Edit/Delete problem modal, collapsible pattern bar chart with `x/target` labels, collections pie chart. |
| **Java Concepts** | 28 seeded concepts across **Java Fundamentals / Collections Framework / Java 8+**, tap-to-cycle status ☐ → ◐ → ✓, 1–5 confidence dots, add & delete concepts, and **14 copy-paste Java DSA templates** (HashMap, PriorityQueue, BFS, DFS, Binary Search, Union Find, Backtracking, Sliding Window, DP, Trie, Trees, Graph build, Two Pointers) plus a core-syntax and collections cheat sheet — each with a copy button. |
| **Daily Tasks** | Date header, `Phase → Month → Week → Day` roadmap breadcrumb, day progress ring, 5 accordion categories (☕ Java DSA, 📚 Java Theory, 📖 CS Fundamentals, 🔨 Development, 📝 Review), animated checkboxes with strikethrough, time/priority/language tags, **swipe-left-to-delete**, **long-press-to-edit**, repeat (None/Daily/Weekly), **"Load Today's Java Plan"** roadmap templates, Pomodoro **25/5** timer with category-wise study-time breakdown. |
| **Statistics** | Weekly study-hours bar chart, problems-per-week line chart, monthly GitHub-style heatmap, totals & completion rate, phase progress + milestone checklist, difficulty pie, pattern-strength radar, weakest patterns, avg-solve-time trend, collections frequency, streak analytics (current, longest, active days, consistency). |
| **/widget** | Compact 4×2 home-screen card: `☕ Java DSA 142/170`, `🔥 Streak 47 days`, `✅ Today 5/9`, `⏱️ Studied 1h 46m` — taps straight into the full app. |

Extras: confetti + **"Day Complete"** celebration screen, haptic feedback on checkboxes,
streak freeze (one per week), daily Java fact, Java quick-reference accessible from every screen,
JSON export/import backups, and a "Reset to demo data" action.

---

## 🧱 Tech stack

- **React 18 + Vite + TypeScript** (strict)
- **Tailwind CSS** — mobile-first, dark by default (375 px primary, responsive up to desktop)
- **Zustand** — app state, persisted settings, pomodoro ticker
- **Dexie.js (IndexedDB)** — `tasks`, `dsaProblems`, `javaConcepts`, `studySessions`, `settings`, `streaks`
- **vite-plugin-pwa** — manifest + Workbox service worker (cache-first, full precache)
- **Lucide React** icons · **Recharts** charts · **date-fns** dates · **Framer Motion** transitions
- **canvas-confetti** for the day-complete celebration

### Theme

| Token | Value |
| --- | --- |
| Background | `#1a1a2e` |
| Cards | `#16213e` |
| Accent (accepted green) | `#00d4aa` |
| Java orange | `#f89820` |
| Easy / Medium / Hard | `#00d4aa` / `#ffa500` / `#ff4757` |
| Text / muted | `#e2e8f0` / `#94a3b8` |

---

## 🚀 Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built PWA on http://localhost:4173
npm run typecheck  # tsc --noEmit
```

> The service worker only exists in a **production build** (`npm run build && npm run preview`).
> Use that when testing offline behaviour or the install prompt.

### First launch

On the very first open the app seeds a realistic ~17-week demo history (142 problems, 210 tasks,
214 study sessions, 120 streak days, 28 Java concepts) so every chart and streak widget has
meaningful data. All of it is ordinary user data: edit or delete anything, or use
**Settings → Reset to demo data** at any time.

---

## 📲 Install on Android (Chrome)

1. Open the deployed URL in **Chrome for Android**.
2. Wait for the first load to finish (the service worker caches everything).
3. Tap the **⋮** menu → **Add to Home screen** → **Install**.
   *(The app also shows its own "Install JavaPrepTracker" banner — tap **Add**.)*
4. Launch it from the home screen: it opens in **standalone** mode (no browser chrome,
   portrait, dark splash with the ☕ logo).

**iOS / Safari:** Share → *Add to Home Screen* (the same offline behaviour applies).

### Home-screen widget

Open the app and visit **`/widget`** (or tap **Home-screen widget** at the bottom of Home),
then use Chrome → ⋮ → **Add to Home screen** while on that URL to get a compact 2×2/4×2 card.
The widget reads live data from the same IndexedDB, and tapping it opens the full app.

---

## 🌐 Deploy

The project is a static SPA — any static host works. `vercel.json` already handles SPA rewrites
and service-worker headers.

### Vercel

```bash
npm i -g vercel
vercel            # link + preview deploy
vercel --prod     # production
```

Or import the Git repo in the Vercel dashboard — the defaults are detected automatically
(Framework: **Vite**, Build: `npm run build`, Output: `dist`).

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --build --prod
```

Build command `npm run build`, publish directory `dist`. Add this `_redirects` file to `public/`
if you host on Netlify and want deep links (`/stats`, `/widget`) to resolve:

```
/*  /index.html  200
```

### Any static server

```bash
npm run build
npx serve dist        # or: python3 -m http.server -d dist 8080
```

> HTTPS (or `localhost`) is required for service-worker registration and installation.

---

## 🗂 Project structure

```
src/
├─ App.tsx                 # router shell, page transitions, global toggles
├─ main.tsx                # React root + splash dismissal
├─ index.css               # Tailwind layers, theme utilities, safe-area helpers
├─ types.ts                # shared domain types
├─ data/
│  ├─ seed.ts              # targets, 28 concepts, 14 Java templates, 20 facts
│  ├─ problems.ts          # 142-row curated LeetCode catalog (45/80/17)
│  └─ plan.ts              # weekly roadmap rotation, phases, milestones
├─ db/
│  ├─ db.ts                # Dexie schema + first-run seeding
│  └─ seedHistory.ts       # deterministic 120-day demo history
├─ store/useStore.ts       # Zustand store (CRUD, streak logic, pomodoro, backups)
├─ lib/{calc,format}.ts    # analytics helpers & formatters
├─ components/             # nav, task row, forms, sheets, celebration, install prompt…
└─ screens/                # Home, DsaTracker, JavaConcepts, Tasks, Stats, Widget
```

### Data model

```ts
tasks        { id, title, category, completed, date, estimatedMinutes,
               priority, language, repeat, createdAt, completedAt }
dsaProblems  { id, problemNumber, problemName, platform, difficulty, pattern,
               status, approach, timeTakenMinutes, spaceComplexity,
               javaCollectionsUsed[], notes, solvedDate }
javaConcepts { id, topic, subtopic, category, status, confidence, lastReviewed }
studySessions{ id, date, durationMinutes, topic, type }
settings     { key, value }
streaks      { date (PK), active, tasksCompleted, totalTasks, freezeUsed }
```

---

## ⚡ Performance & offline notes

- Production JS is split into `vendor` (React/Router/Framer), `charts` (Recharts) and app chunks;
  everything is precached by Workbox (~1.1 MB total, well under the 2 MB budget).
- Fonts are a system stack (`Inter` if installed, otherwise `system-ui`) — **no external requests**,
  so the first paint is not blocked by a font CDN.
- The splash screen is inline HTML/CSS in `index.html`, so something branded paints immediately
  while React and IndexedDB boot.
- Navigations fall back to `index.html`, so every route (`/dsa`, `/stats`, `/widget`) works offline.
- Data persists across restarts; use **Settings → Export JSON** for manual backups.

---

## 🧪 Manual QA checklist

- [ ] First launch seeds demo data and the splash disappears.
- [ ] Home: streak shows `Day 47`, heatmap fills, ring shows `5/9`.
- [ ] Tasks: check a task → strike-through, haptic, study time increases; complete all → confetti + Day Complete.
- [ ] Tasks: swipe a row left → Delete; long-press (or double-tap) → edit sheet.
- [ ] DSA: search, filter by difficulty/pattern/collection/date, sort, add & delete a problem.
- [ ] Java: cycle a concept status, open a template, copy code.
- [ ] Stats: all charts render, milestones reflect data.
- [ ] Build + preview → DevTools → Application → Service Worker: registered, offline reload works.
- [ ] Install on Android: standalone launch, no browser bar, dark splash with ☕.

---

Built for one goal: **land the placement**. ☕🔥
