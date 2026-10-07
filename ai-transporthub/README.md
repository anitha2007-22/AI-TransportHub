# AI TransportHub — Intelligent Mobility Decision Platform

> A complete hackathon-ready AI web application · React 18 + Tailwind + Claude AI

## ✅ Project complete — all 8 phases shipped

| Phase | Module                          | Status  |
|-------|---------------------------------|---------|
| 1     | Setup · Auth · Dashboard layout | ✅ Done |
| 2     | AI Journey Planner              | ✅ Done |
| 3     | Traffic Intelligence            | ✅ Done |
| 4     | Carbon Footprint Tracker        | ✅ Done |
| 5     | Voice Assistant + Reports + Notifications | ✅ Done |
| 6     | Authority Analytics Dashboard   | ✅ Done |
| 7     | Admin Panels (Users/Transport/Settings) | ✅ Done |
| 8     | Deployment config + guides      | ✅ Done |

## Quick start

```bash
npm install
cp .env.example .env        # add VITE_ANTHROPIC_API_KEY
npm run dev                 # → http://localhost:5173
```

## Demo accounts

| Role      | Email                | Password  |
|-----------|----------------------|-----------|
| Commuter  | arjun@demo.com       | demo1234  |
| Authority | authority@demo.com   | demo1234  |
| Admin     | admin@demo.com       | demo1234  |

## Full feature list

**Authentication** — Login · Signup · Forgot password · Role-based access · Dark mode

**Commuter Dashboard** — AI daily insight · KPI cards · Today's trips · Carbon chart · Live traffic · Weather widget

**AI Journey Planner** — Source/destination autocomplete · 4 route types (Fastest/Cheapest/Eco/Safest) · Step-by-step directions · Route comparison table · OSM map · Claude AI insight panel

**Traffic Intelligence** — Leaflet heatmap (16 Chennai zones) · 24h congestion forecast chart · Zone summary table · Incident feed with filters · Claude AI traffic briefing

**Carbon Footprint** — Eco score ring · 8-week trend chart · Mode share donut · Interactive carbon calculator (8 transport modes, real emission factors) · Trip history · Eco badges · City leaderboard · Claude AI eco coach

**Voice Assistant** — 4 languages (English/Tamil/Hindi/Tanglish) · Web Speech API · Claude NLU → SpeechSynthesis output · Text fallback · Chat transcript

**Citizen Reporting** — 8 issue types · Priority levels · Image upload · Post-submit confirmation · Community reports with upvote · Status tracking

**Notifications** — Category filter tabs · Priority borders · Hover-to-dismiss · Mark all read · Clear all

**Authority Analytics** — 8 KPI cards · Peak hours multi-line chart · City CO₂ chart · Popular routes table · Live transport feed · Citizen reports panel

**Admin — Users** — User table · Search/filter · Role change · Activate/Suspend · Audit trail

**Admin — Transport** — API integration status (Google Maps/CMRL/MTC/Firebase) · Route toggle · Live feed preview

**Admin — Settings** — API key management · Notification rules · AI model config · Eco weight slider · Audit log

## Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS v3, Framer Motion, React Router v6
- **Charts:** Recharts (area, bar, line, pie/donut)
- **Maps:** Leaflet + react-leaflet (OpenStreetMap tiles)
- **AI:** Anthropic claude-sonnet-4-6 via `/v1/messages`
- **Voice:** Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Notifications:** react-hot-toast (swap Firebase for push)
- **Icons:** Lucide React

## File structure

```
src/
├── components/
│   ├── authority/   PeakHoursChart · PopularRoutesTable · TransportFeed · CityCarbonChart
│   ├── carbon/      EcoScoreRing · CarbonCalculator · CarbonTrendChart · ModeShareChart
│   │                TripHistoryTable · EcoBadges · Leaderboard · AICarbonInsight
│   ├── dashboard/   MetricCard · TrafficWidget · WeatherWidget · CarbonChart
│   │                TodayTrips · AIInsightBanner
│   ├── layout/      AppLayout · Sidebar · Topbar
│   ├── planner/     JourneyForm · LocationInput · RouteCard · RouteComparison
│   │                MapView · AIRouteInsight
│   ├── traffic/     HeatMap · CongestionChart · ZoneTable · IncidentFeed
│   │                TrafficMetricBar · AITrafficInsight
│   └── voice/       VoiceOrb · LanguagePicker · ChatBubble · SampleQueries
├── context/         AuthContext · ThemeContext
├── hooks/           useVoiceAssistant
├── pages/           12 pages (Dashboard → Admin Settings)
└── utils/           mockData.js (all simulated datasets)
```

See `DEPLOYMENT.md` for full deployment instructions.
