# AI TransportHub — Deployment Guide

## Quick start (local dev)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and add your Anthropic API key (minimum required for AI features)

# 3. Start dev server
npm run dev
# → http://localhost:5173
```

## Demo login credentials

| Role      | Email                | Password  |
|-----------|----------------------|-----------|
| Commuter  | arjun@demo.com       | demo1234  |
| Authority | authority@demo.com   | demo1234  |
| Admin     | admin@demo.com       | demo1234  |

---

## Production build

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

---

## Deploy to Vercel (recommended — free)

```bash
npm install -g vercel
vercel
# Follow prompts — set env vars in Vercel dashboard
```

Add these env vars in **Vercel Dashboard → Project → Settings → Environment Variables**:
- `VITE_ANTHROPIC_API_KEY`
- `VITE_GOOGLE_MAPS_API_KEY` (optional)
- `VITE_WEATHER_API_KEY` (optional)

---

## Deploy to Netlify

```bash
npm run build
# Drag the dist/ folder to app.netlify.com/drop
# Or connect your GitHub repo and set build command: npm run build, publish dir: dist
```

---

## Deploy to GitHub Pages

```bash
# Add to vite.config.js: base: '/ai-transporthub/'
npm run build
npx gh-pages -d dist
```

---

## Feature flags (what works without API keys)

| Feature                  | Without API key         | With VITE_ANTHROPIC_API_KEY |
|--------------------------|-------------------------|-----------------------------|
| All dashboards & charts  | ✅ Full                 | ✅ Full                     |
| Traffic heatmap          | ✅ Full (OSM tiles)     | ✅ Full                     |
| Journey planner routes   | ✅ Simulated routes     | ✅ Simulated routes          |
| AI Route Insight         | ✅ Smart fallback tips  | ✅ Live Claude response      |
| AI Traffic Briefing      | ✅ Smart fallback tips  | ✅ Live Claude response      |
| AI Eco Coach             | ✅ Rotating fallback    | ✅ Personalised Claude tip   |
| Voice assistant (text)   | ✅ Smart fallback       | ✅ Live Claude + voice out   |
| Carbon calculator        | ✅ Full                 | ✅ Full                     |
| Reports & notifications  | ✅ Full                 | ✅ Full                     |
| Admin panels             | ✅ Full                 | ✅ Full                     |

---

## Architecture overview

```
Frontend (React 18 + Vite + Tailwind)
│
├── Auth layer       → Context-based JWT simulation (swap for real backend)
├── AI layer         → Anthropic claude-sonnet-4-6 via /v1/messages
├── Maps layer       → OpenStreetMap (Leaflet) · swap for Google Maps JS API
├── Voice layer      → Web Speech API (browser-native) + SpeechSynthesis
├── Charts layer     → Recharts (all client-side, no server needed)
└── Notifications    → In-app (swap Firebase for push in production)

Where to plug in real APIs:
  src/utils/mockData.js      → Replace mock arrays with fetch() calls
  src/components/planner/MapView.jsx → Replace OSM iframe with Google Maps JS
  src/components/traffic/HeatMap.jsx → Replace circle markers with real GTFS data
  src/context/AuthContext.jsx        → Replace mock users with real JWT endpoint
```

---

## Hackathon presentation checklist

- [ ] Demo on `arjun@demo.com` (commuter journey — most features)
- [ ] Show Journey Planner: T. Nagar → Chennai Airport, compare routes
- [ ] Show Traffic page: heatmap tab → zones tab → incidents tab
- [ ] Show Carbon page: eco score ring + calculator (switch car → metro)
- [ ] Show Voice: type "Take me to Marina Beach" and see AI reply
- [ ] Switch to `authority@demo.com` → show Analytics dashboard
- [ ] Switch to `admin@demo.com` → show User Management
- [ ] Toggle dark mode (sun/moon in topbar)
- [ ] Show mobile responsive layout (resize browser)
