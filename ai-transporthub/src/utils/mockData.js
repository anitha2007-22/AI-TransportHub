/**
 * mockData.js — simulated datasets for demo
 * In production, replace with real API calls (Google Maps, weather, transport feeds)
 */

export const TRAFFIC_DATA = {
  current: [
    { route: "Anna Nagar → Airport", congestion: 72, time: "34 min", status: "heavy" },
    { route: "T. Nagar → Central", congestion: 45, time: "18 min", status: "moderate" },
    { route: "Adyar → OMR", congestion: 28, time: "22 min", status: "light" },
    { route: "Guindy → Tambaram", congestion: 60, time: "27 min", status: "moderate" },
  ],
  prediction: [6.2, 7.1, 8.5, 9.2, 8.8, 7.3, 6.1, 5.4, 5.8, 7.2, 8.1, 8.9, 7.6, 6.8, 6.2, 7.0, 8.3, 9.1, 8.7, 7.2, 6.0, 5.2, 4.8, 4.1],
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
};

export const WEATHER_DATA = {
  temp: 34,
  condition: "Partly Cloudy",
  humidity: 78,
  wind: 14,
  advisory: "Heavy rain expected after 6 PM. Consider early departure.",
  icon: "⛅",
};

export const TRIPS_TODAY = [
  { id: 1, from: "Home", to: "Office", time: "08:15 AM", mode: "Metro + Walk", saved: 1.2, status: "completed" },
  { id: 2, from: "Office", to: "Client Meeting", time: "01:30 PM", mode: "Cab", saved: 0.0, status: "upcoming" },
  { id: 3, from: "Client", to: "Home", time: "06:45 PM", mode: "Bus + Metro", saved: 2.1, status: "scheduled" },
];

export const CARBON_WEEKLY = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  saved: [1.2, 2.4, 1.8, 3.1, 2.6, 0.8, 1.5],
  emitted: [2.1, 1.4, 2.5, 1.2, 1.8, 3.2, 2.0],
};

export const NOTIFICATIONS = [
  { id: 1, type: "alert", title: "Traffic incident on Mount Road", desc: "Multi-vehicle accident causing 20-min delays", time: "5 min ago", read: false },
  { id: 2, type: "weather", title: "Rain advisory for South Chennai", desc: "Carry an umbrella — showers expected 4–7 PM", time: "1 hr ago", read: false },
  { id: 3, type: "info", title: "Metro Line 3 extended hours today", desc: "Last train shifted to 11:45 PM on weekends", time: "3 hr ago", read: true },
  { id: 4, type: "eco", title: "Weekly eco report ready", desc: "You saved 13.4 kg CO₂ this week — top 8%!", time: "6 hr ago", read: true },
];

export const ROUTE_OPTIONS = [
  {
    id: "fastest", label: "Fastest", badge: "Recommended", time: "28 min", cost: "₹120", carbon: "0.8 kg", crowd: "Moderate",
    steps: ["Walk 3 min to Metro Station", "Metro (Green Line) — 14 stops", "Cab 5 min to destination"],
    color: "primary",
  },
  {
    id: "cheapest", label: "Cheapest", badge: null, time: "42 min", cost: "₹18", carbon: "0.3 kg", crowd: "High",
    steps: ["Walk 5 min to Bus Stop", "Bus 23C — 18 stops", "Walk 7 min to destination"],
    color: "eco",
  },
  {
    id: "eco", label: "Eco Route", badge: "Greenest", time: "35 min", cost: "₹45", carbon: "0.1 kg", crowd: "Low",
    steps: ["Cycle 8 min to Metro", "Metro (Blue Line) — 10 stops", "Walk 6 min"],
    color: "green",
  },
];

export const CITY_STATS = {
  activeVehicles: 42350,
  publicTransportUsage: 67,
  avgCongestion: 54,
  co2SavedToday: 8.4,
  citizenReports: 23,
  routesOptimized: 1240,
};

// ─── Journey Planner data ────────────────────────────────────────────────────

// Popular Chennai locations for autocomplete
export const CHENNAI_LOCATIONS = [
  "Chennai Central Railway Station",
  "Chennai Airport (MAA)",
  "T. Nagar Bus Terminus",
  "Anna Nagar Tower",
  "Adyar Signal",
  "Guindy Metro Station",
  "Velachery Metro Station",
  "Tambaram Bus Stand",
  "OMR (Old Mahabalipuram Road)",
  "ECR (East Coast Road)",
  "Koyambedu Bus Terminus",
  "Egmore Railway Station",
  "Vadapalani Metro Station",
  "Porur Junction",
  "Sholinganallur Junction",
  "Tidel Park",
  "DLF IT Park, Ambattur",
  "IIT Madras Gate",
  "Besant Nagar Beach",
  "Marina Beach",
  "Spencer Plaza",
  "Express Avenue Mall",
  "Phoenix MarketCity",
  "Tiruppur Bus Stand",
  "Coimbatore Railway Station",
];

// Route options returned by the AI planner
export const generateRoutes = (from, to, time) => [
  {
    id: "fastest",
    label: "Fastest",
    tag: "AI Recommended",
    tagColor: "primary",
    duration: "28 min",
    distance: "14.2 km",
    cost: "₹120",
    carbon: "0.8 kg CO₂",
    crowd: "Moderate",
    crowdLevel: 55,
    weather: "Safe",
    steps: [
      { mode: "walk",   icon: "🚶", desc: "Walk 4 min to Guindy Metro Station", duration: "4 min" },
      { mode: "metro",  icon: "🚇", desc: "Metro Green Line → 11 stops to Central", duration: "18 min" },
      { mode: "walk",   icon: "🚶", desc: "Walk 6 min to destination", duration: "6 min" },
    ],
    pros: ["Fastest option", "Avoids peak-hour traffic", "Covered route"],
    cons: ["Crowded metro at this hour"],
    aiScore: 91,
  },
  {
    id: "cheapest",
    label: "Cheapest",
    tag: "Budget Pick",
    tagColor: "amber",
    duration: "44 min",
    distance: "15.8 km",
    cost: "₹18",
    carbon: "0.4 kg CO₂",
    crowd: "High",
    crowdLevel: 80,
    weather: "Safe",
    steps: [
      { mode: "walk",   icon: "🚶", desc: "Walk 5 min to Bus Stop #23A", duration: "5 min" },
      { mode: "bus",    icon: "🚌", desc: "Bus 23C → 18 stops (Koyambedu → Central)", duration: "32 min" },
      { mode: "walk",   icon: "🚶", desc: "Walk 7 min to destination", duration: "7 min" },
    ],
    pros: ["Very affordable", "Frequent service"],
    cons: ["Longer travel time", "Crowded during rush hour"],
    aiScore: 74,
  },
  {
    id: "eco",
    label: "Eco Route",
    tag: "Greenest",
    tagColor: "green",
    duration: "37 min",
    distance: "13.6 km",
    cost: "₹45",
    carbon: "0.1 kg CO₂",
    crowd: "Low",
    crowdLevel: 25,
    weather: "Safe",
    steps: [
      { mode: "cycle",  icon: "🚲", desc: "Cycle 8 min to Velachery Metro", duration: "8 min" },
      { mode: "metro",  icon: "🚇", desc: "Metro Blue Line → 9 stops", duration: "22 min" },
      { mode: "walk",   icon: "🚶", desc: "Walk 7 min to destination", duration: "7 min" },
    ],
    pros: ["Lowest carbon footprint", "Low crowd", "Scenic cycle stretch"],
    cons: ["Requires a cycle", "Slightly longer"],
    aiScore: 88,
  },
  {
    id: "safest",
    label: "Safest",
    tag: "Weather Safe",
    tagColor: "purple",
    duration: "32 min",
    distance: "15.1 km",
    cost: "₹280",
    carbon: "2.1 kg CO₂",
    crowd: "Low",
    crowdLevel: 20,
    weather: "Excellent",
    steps: [
      { mode: "cab",    icon: "🚕", desc: "Direct cab — door to door", duration: "32 min" },
    ],
    pros: ["Door-to-door comfort", "No transfers", "Best in bad weather"],
    cons: ["Most expensive", "Higher emissions"],
    aiScore: 79,
  },
];

// AI chat messages for the planner assistant
export const PLANNER_AI_INTRO = "I've analysed 4 route options for you. The **Fastest Route** via Guindy Metro is my top pick — it saves 16 minutes vs the next option and avoids the GST Road congestion currently at 72%. Tap any route to see step-by-step directions.";

// ─── Traffic Module data ──────────────────────────────────────────────────────

// 24-hour traffic prediction (congestion %, hour 0–23)
export const TRAFFIC_HOURLY = [
  18, 14, 10, 8, 10, 22, 48, 74, 88, 82, 68, 60,
  65, 70, 63, 58, 64, 84, 91, 85, 72, 54, 38, 24,
];

// Heatmap grid points over Chennai (lat, lng, intensity 0–1)
export const HEATMAP_POINTS = [
  // Central / Egmore
  { lat: 13.082, lng: 80.275, intensity: 0.88, zone: "Central" },
  { lat: 13.079, lng: 80.271, intensity: 0.82, zone: "Egmore" },
  // T. Nagar
  { lat: 13.040, lng: 80.233, intensity: 0.91, zone: "T. Nagar" },
  { lat: 13.043, lng: 80.237, intensity: 0.85, zone: "T. Nagar" },
  // Anna Nagar
  { lat: 13.086, lng: 80.209, intensity: 0.55, zone: "Anna Nagar" },
  { lat: 13.090, lng: 80.214, intensity: 0.60, zone: "Anna Nagar" },
  // Guindy / Airport
  { lat: 13.009, lng: 80.220, intensity: 0.72, zone: "Guindy" },
  { lat: 13.002, lng: 80.178, intensity: 0.45, zone: "Airport" },
  // Adyar
  { lat: 13.000, lng: 80.257, intensity: 0.68, zone: "Adyar" },
  { lat: 12.997, lng: 80.260, intensity: 0.65, zone: "Adyar" },
  // OMR / Sholinganallur
  { lat: 12.900, lng: 80.228, intensity: 0.38, zone: "Sholinganallur" },
  { lat: 12.872, lng: 80.222, intensity: 0.28, zone: "OMR South" },
  // Porur
  { lat: 13.036, lng: 80.158, intensity: 0.42, zone: "Porur" },
  // Tambaram
  { lat: 12.923, lng: 80.127, intensity: 0.35, zone: "Tambaram" },
  // Velachery
  { lat: 12.978, lng: 80.221, intensity: 0.74, zone: "Velachery" },
  // Koyambedu
  { lat: 13.070, lng: 80.194, intensity: 0.80, zone: "Koyambedu" },
];

// Live incident feed
export const TRAFFIC_INCIDENTS = [
  {
    id: 1, severity: "critical", type: "Accident",
    location: "Anna Salai near Gemini Flyover",
    desc: "Multi-vehicle collision blocking 2 lanes. Expect 30-min delay.",
    reported: "8 min ago", lat: 13.060, lng: 80.249, active: true,
  },
  {
    id: 2, severity: "high", type: "Road Work",
    location: "GST Road, Chromepet",
    desc: "Lane narrowing due to Metro Phase 2 construction. Night closure 10 PM–6 AM.",
    reported: "1 hr ago", lat: 12.952, lng: 80.144, active: true,
  },
  {
    id: 3, severity: "medium", type: "Waterlogging",
    location: "Poonamallee High Road, Arumbakkam",
    desc: "Knee-deep waterlogging after last night's rain. Avoid in low vehicles.",
    reported: "2 hr ago", lat: 13.069, lng: 80.207, active: true,
  },
  {
    id: 4, severity: "medium", type: "Signal Down",
    location: "Vadapalani junction",
    desc: "Traffic signal malfunction. Manual traffic control underway.",
    reported: "3 hr ago", lat: 13.050, lng: 80.212, active: true,
  },
  {
    id: 5, severity: "low", type: "Event Diversion",
    location: "Marina Beach Rd",
    desc: "Beach road partially closed for public event until 9 PM.",
    reported: "4 hr ago", lat: 13.054, lng: 80.283, active: false,
  },
  {
    id: 6, severity: "low", type: "Vehicle Breakdown",
    location: "OMR near Perungudi Toll",
    desc: "Heavy vehicle breakdown in left lane. Partial obstruction.",
    reported: "5 hr ago", lat: 12.961, lng: 80.243, active: false,
  },
];

// Congestion by area (for the zone summary table)
export const ZONE_CONGESTION = [
  { zone: "T. Nagar",      level: 91, trend: +3,  peakHour: "8–10 AM" },
  { zone: "Central",       level: 88, trend: -2,  peakHour: "9–11 AM" },
  { zone: "Koyambedu",     level: 80, trend: +5,  peakHour: "7–9 AM" },
  { zone: "Velachery",     level: 74, trend: +1,  peakHour: "8–10 AM" },
  { zone: "Guindy",        level: 72, trend: -4,  peakHour: "8–10 AM" },
  { zone: "Adyar",         level: 68, trend: 0,   peakHour: "6–8 PM" },
  { zone: "Anna Nagar",    level: 58, trend: -1,  peakHour: "8–9 AM" },
  { zone: "Porur",         level: 42, trend: +2,  peakHour: "9–10 AM" },
  { zone: "Sholinganallur",level: 38, trend: -3,  peakHour: "7–9 PM" },
  { zone: "Tambaram",      level: 35, trend: +1,  peakHour: "7–9 AM" },
];

// ─── Carbon Footprint Module data ────────────────────────────────────────────

// Emission factors kg CO₂ per km — real IPCC/DEFRA values
export const EMISSION_FACTORS = {
  car:        0.171,   // average petrol car
  cab:        0.171,
  bus:        0.089,
  metro:      0.041,
  bike:       0.0,
  walk:       0.0,
  cycle:      0.0,
  autoRickshaw: 0.097,
};

// User's trip history for the past 4 weeks
export const TRIP_HISTORY = [
  { id: 1,  date: "2025-07-22", from: "Home",   to: "Office",   mode: "metro",  km: 12.4, co2: 0.51, moneySaved: 95,  fuelSaved: 0.42 },
  { id: 2,  date: "2025-07-22", from: "Office", to: "T. Nagar", mode: "bus",    km: 5.2,  co2: 0.46, moneySaved: 80,  fuelSaved: 0.21 },
  { id: 3,  date: "2025-07-21", from: "Home",   to: "Office",   mode: "metro",  km: 12.4, co2: 0.51, moneySaved: 95,  fuelSaved: 0.42 },
  { id: 4,  date: "2025-07-21", from: "Office", to: "Adyar",    mode: "cab",    km: 8.1,  co2: 1.38, moneySaved: 0,   fuelSaved: 0 },
  { id: 5,  date: "2025-07-20", from: "Home",   to: "Airport",  mode: "metro",  km: 22.0, co2: 0.90, moneySaved: 310, fuelSaved: 0.95 },
  { id: 6,  date: "2025-07-19", from: "Home",   to: "Office",   mode: "bus",    km: 13.1, co2: 1.17, moneySaved: 55,  fuelSaved: 0.52 },
  { id: 7,  date: "2025-07-18", from: "Home",   to: "Office",   mode: "metro",  km: 12.4, co2: 0.51, moneySaved: 95,  fuelSaved: 0.42 },
  { id: 8,  date: "2025-07-17", from: "Mall",   to: "Home",     mode: "cab",    km: 9.3,  co2: 1.59, moneySaved: 0,   fuelSaved: 0 },
];

// Weekly aggregates for the past 8 weeks
export const CARBON_MONTHLY = {
  labels: ["Jun W1","Jun W2","Jun W3","Jun W4","Jul W1","Jul W2","Jul W3","Jul W4"],
  emitted: [14.2, 12.8, 11.4, 10.9, 13.1, 9.8, 8.6, 7.2],
  saved:   [3.1,  4.6,  5.8,  6.4,  4.2,  7.1, 8.3, 9.4],
};

// Mode share breakdown for pie chart
export const MODE_SHARE = [
  { name: "Metro",    value: 42, color: "#2563eb", co2: "Low" },
  { name: "Bus",      value: 28, color: "#16a34a", co2: "Low" },
  { name: "Cab",      value: 18, color: "#f59e0b", co2: "High" },
  { name: "Walk",     value: 8,  color: "#22c55e", co2: "Zero" },
  { name: "Auto",     value: 4,  color: "#8b5cf6", co2: "Medium" },
];

// Eco badges unlocked / locked
export const ECO_BADGES = [
  { id: "first_green",  icon: "🌱", label: "First Green Trip",    desc: "Completed your first eco-friendly journey", unlocked: true  },
  { id: "week_streak",  icon: "🔥", label: "7-Day Streak",        desc: "Used public transport 7 days in a row",      unlocked: true  },
  { id: "tree_saver",   icon: "🌳", label: "Tree Saver",          desc: "Saved 10+ kg CO₂ in a single month",        unlocked: true  },
  { id: "metro_master", icon: "🚇", label: "Metro Master",        desc: "50+ metro trips completed",                 unlocked: true  },
  { id: "carbon_hero",  icon: "⚡", label: "Carbon Hero",         desc: "Save 25 kg CO₂ in a month",                unlocked: false },
  { id: "zero_cab",     icon: "🚫", label: "Cab-Free Week",       desc: "7 consecutive days without a cab",          unlocked: false },
  { id: "top_5",        icon: "🏆", label: "City Top 5%",         desc: "Reach top 5% eco score in Chennai",         unlocked: false },
  { id: "annual",       icon: "🎖️", label: "Annual Eco Champion", desc: "Sustain top eco score for 12 months",       unlocked: false },
];

// Leaderboard — top commuters this month
export const LEADERBOARD = [
  { rank: 1, name: "Deepa S.",    avatar: "DS", score: 97, saved: "31.2 kg", city: "Adyar" },
  { rank: 2, name: "Rajan M.",   avatar: "RM", score: 94, saved: "28.7 kg", city: "Anna Nagar" },
  { rank: 3, name: "Preethi K.", avatar: "PK", score: 91, saved: "26.1 kg", city: "Velachery" },
  { rank: 4, name: "You (Arjun)", avatar: "AK", score: 82, saved: "19.4 kg", city: "Guindy", isUser: true },
  { rank: 5, name: "Surya T.",   avatar: "ST", score: 79, saved: "17.8 kg", city: "T. Nagar" },
  { rank: 6, name: "Kavitha R.", avatar: "KR", score: 75, saved: "15.2 kg", city: "Tambaram" },
];

// ─── Voice Assistant data ────────────────────────────────────────────────────

export const VOICE_LANGUAGES = [
  { id: "en-IN",    label: "English",   flag: "🇬🇧", greeting: "Hello! Where would you like to go?", native: "English" },
  { id: "ta-IN",    label: "Tamil",     flag: "🇮🇳", greeting: "வணக்கம்! நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள்?", native: "தமிழ்" },
  { id: "hi-IN",    label: "Hindi",     flag: "🇮🇳", greeting: "नमस्ते! आप कहाँ जाना चाहते हैं?", native: "हिंदी" },
  { id: "tanglish", label: "Tanglish",  flag: "🌐", greeting: "Vanakkam! Enga poganum nu sollunga!", native: "Tanglish" },
];

export const SAMPLE_VOICE_QUERIES = [
  { lang: "en-IN",    text: "Take me to Chennai Airport", icon: "✈️" },
  { lang: "ta-IN",    text: "Enakku airport poganum", icon: "🚇" },
  { lang: "tanglish", text: "Central kita poi drop pannunga", icon: "🚌" },
  { lang: "hi-IN",    text: "Marina beach kaise jaayein", icon: "🌊" },
];

// ─── Citizen Reports data ────────────────────────────────────────────────────

export const REPORT_TYPES = [
  { id: "accident",       label: "Accident",         icon: "🚨", color: "bg-red-100 text-red-700 border-red-200" },
  { id: "road_damage",    label: "Road Damage",      icon: "🕳️", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "waterlogging",   label: "Waterlogging",     icon: "🌊", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "signal_issue",   label: "Signal Issue",     icon: "🚦", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "traffic_jam",    label: "Traffic Jam",      icon: "🚗", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "broken_light",   label: "Broken Street Light", icon: "💡", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "bus_breakdown",  label: "Bus Breakdown",    icon: "🚌", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { id: "other",          label: "Other",            icon: "📋", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

export const EXISTING_REPORTS = [
  { id: 1, type: "accident",     location: "Anna Salai, Gemini",          status: "investigating", priority: "critical", time: "10 min ago", votes: 24, img: null },
  { id: 2, type: "waterlogging", location: "Poonamallee High Rd",          status: "acknowledged",  priority: "high",     time: "1 hr ago",   votes: 18, img: null },
  { id: 3, type: "signal_issue", location: "Vadapalani junction",          status: "resolved",      priority: "medium",   time: "3 hr ago",   votes: 9,  img: null },
  { id: 4, type: "road_damage",  location: "ECR near Kovalam",             status: "pending",       priority: "medium",   time: "5 hr ago",   votes: 6,  img: null },
  { id: 5, type: "traffic_jam",  location: "OMR Perungudi Toll",           status: "pending",       priority: "low",      time: "6 hr ago",   votes: 3,  img: null },
];

// ─── Notifications data (enriched) ──────────────────────────────────────────

export const ALL_NOTIFICATIONS = [
  { id: 1,  cat: "alert",   icon: "🚨", title: "Accident on Anna Salai",           body: "Multi-vehicle accident near Gemini Flyover blocking 2 lanes. Expect 25–35 min delay.",  time: "5 min ago",  read: false, priority: "critical" },
  { id: 2,  cat: "weather", icon: "🌧️", title: "Heavy rain advisory — South Chennai", body: "IMD forecast: heavy showers 4–8 PM. Roads in Adyar and Besant Nagar may flood.",       time: "30 min ago", read: false, priority: "high" },
  { id: 3,  cat: "transit", icon: "🚇", title: "Metro Green Line — 10 min delay",  body: "Signal issue at Alandur station causing 10-minute delay on the Green Line.",             time: "45 min ago", read: false, priority: "medium" },
  { id: 4,  cat: "eco",     icon: "🌿", title: "Weekly eco report ready",           body: "You saved 13.4 kg CO₂ this week — top 8% in Chennai! Check your full carbon report.",   time: "2 hr ago",   read: true,  priority: "low" },
  { id: 5,  cat: "alert",   icon: "🚧", title: "Road closure — T. Nagar loop road", body: "Loop road closed for Metro Phase 2 construction until Friday 10 PM.",                   time: "3 hr ago",   read: true,  priority: "medium" },
  { id: 6,  cat: "transit", icon: "🚌", title: "Bus route 23C — diversion today",  body: "Route 23C diverted via Usman Road due to bypass work. Extra 8 min travel time.",        time: "4 hr ago",   read: true,  priority: "low" },
  { id: 7,  cat: "ai",      icon: "✨", title: "AI tip: Beat tomorrow's traffic",  body: "Tomorrow is a long weekend. Expect 40% higher congestion 6–9 PM. Leave by 4:30 PM.",     time: "5 hr ago",   read: true,  priority: "low" },
  { id: 8,  cat: "eco",     icon: "🏅", title: "New badge unlocked: Metro Master", body: "Congratulations! You've completed 50 metro trips. Your eco score jumped to 82.",         time: "1 day ago",  read: true,  priority: "low" },
];

// ─── Authority Dashboard data ─────────────────────────────────────────────────

export const PEAK_HOURS_DATA = {
  labels: ["6AM","7AM","8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"],
  mon: [12,38,82,91,68,55,60,65,58,54,72,86,91,78,52,30],
  tue: [11,35,79,88,65,52,58,62,55,51,68,84,89,75,49,28],
  wed: [13,40,85,93,70,57,63,67,60,56,74,88,92,80,54,32],
  thu: [10,33,76,85,62,50,55,60,52,48,65,81,86,72,46,26],
  fri: [14,42,88,95,72,60,66,70,63,58,77,90,94,83,58,36],
};

export const POPULAR_ROUTES = [
  { route: "Home → OMR (IT corridor)",    trips: 18420, pct: 94, trend: +8  },
  { route: "Tambaram → Central",           trips: 14230, pct: 72, trend: +3  },
  { route: "Koyambedu → T. Nagar",        trips: 12180, pct: 62, trend: -2  },
  { route: "Adyar → Guindy",              trips: 9840,  pct: 50, trend: +5  },
  { route: "Anna Nagar → Egmore",         trips: 8620,  pct: 44, trend: +1  },
  { route: "Velachery → Airport",          trips: 7110,  pct: 36, trend: -4  },
];

export const AUTHORITY_METRICS = {
  totalTripsToday:    142830,
  publicTransitShare: 67,
  avgCongestion:      54,
  co2SavedTonnes:     8.4,
  activeIncidents:    4,
  resolvedToday:      12,
  citizenReports:     23,
  routesOptimised:    1240,
};

export const TRANSPORT_FEED = [
  { id: "MET-04", type: "metro",  line: "Green Line", status: "delayed",  delay: "+10 min", passengers: 1840, lastUpdate: "3 min ago" },
  { id: "MET-07", type: "metro",  line: "Blue Line",  status: "on-time",  delay: null,       passengers: 2210, lastUpdate: "2 min ago" },
  { id: "BUS-23C", type: "bus",   line: "Route 23C",  status: "diverted", delay: "+8 min",  passengers: 64,   lastUpdate: "5 min ago" },
  { id: "BUS-47A", type: "bus",   line: "Route 47A",  status: "on-time",  delay: null,       passengers: 48,   lastUpdate: "1 min ago" },
  { id: "BUS-12B", type: "bus",   line: "Route 12B",  status: "on-time",  delay: null,       passengers: 71,   lastUpdate: "4 min ago" },
];

export const CITY_CO2_WEEKLY = {
  labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  target:  [10, 10, 10, 10, 10, 7, 7],
  actual:  [8.4, 9.1, 7.8, 8.6, 9.8, 5.2, 4.9],
};
