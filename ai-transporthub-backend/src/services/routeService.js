/**
 * routeService.js — AI-powered route generation and scoring
 *
 * In production: replace generateRouteOptions() with real calls to:
 *   - Google Maps Directions API (for road + transit routing)
 *   - CMRL GTFS feed (for metro stop-level detail)
 *   - MTC GTFS feed (for bus routes)
 *   - OpenWeatherMap (for weather-based safety scoring)
 *
 * For demo: returns realistic simulated routes with AI scoring
 */
const { calculateTripCarbon } = require("./carbonService");

// Simulated routing logic — replace with real API calls in production
const generateRouteOptions = async (from, to, departureTime, prefs = []) => {
  // In production: const googleRoutes = await mapsClient.directions({...});
  const hour = new Date(departureTime).getHours();
  const isPeak = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);

  // Base durations in minutes — scale by peak hour factor
  const peakFactor = isPeak ? 1.35 : 1.0;

  const routes = [
    {
      id:       "fastest",
      label:    "Fastest",
      tag:      "AI Recommended",
      tagColor: "primary",
      durationMinutes: Math.round(28 * peakFactor),
      distanceKm:      14.2,
      costRupees:      120,
      mode:            "metro",
      crowdLevel:      isPeak ? 75 : 45,
      weather:         "Safe",
      steps: [
        { mode: "walk",  icon: "🚶", desc: "Walk 4 min to Guindy Metro Station",        duration: "4 min" },
        { mode: "metro", icon: "🚇", desc: "Metro Green Line → 11 stops to Central",    duration: "18 min" },
        { mode: "walk",  icon: "🚶", desc: "Walk 6 min to destination",                 duration: "6 min" },
      ],
    },
    {
      id:       "cheapest",
      label:    "Cheapest",
      tag:      "Budget Pick",
      tagColor: "amber",
      durationMinutes: Math.round(44 * peakFactor),
      distanceKm:      15.8,
      costRupees:      18,
      mode:            "bus",
      crowdLevel:      isPeak ? 88 : 55,
      weather:         "Safe",
      steps: [
        { mode: "walk", icon: "🚶", desc: "Walk 5 min to Bus Stop #23A",                duration: "5 min" },
        { mode: "bus",  icon: "🚌", desc: "Bus 23C → 18 stops (Koyambedu → Central)",  duration: "32 min" },
        { mode: "walk", icon: "🚶", desc: "Walk 7 min to destination",                  duration: "7 min" },
      ],
    },
    {
      id:       "eco",
      label:    "Eco Route",
      tag:      "Greenest",
      tagColor: "green",
      durationMinutes: Math.round(37 * peakFactor),
      distanceKm:      13.6,
      costRupees:      45,
      mode:            "cycle",
      crowdLevel:      22,
      weather:         "Safe",
      steps: [
        { mode: "cycle", icon: "🚲", desc: "Cycle 8 min to Velachery Metro",            duration: "8 min" },
        { mode: "metro", icon: "🚇", desc: "Metro Blue Line → 9 stops",                duration: "22 min" },
        { mode: "walk",  icon: "🚶", desc: "Walk 7 min to destination",                 duration: "7 min" },
      ],
    },
    {
      id:       "safest",
      label:    "Safest",
      tag:      "Weather Safe",
      tagColor: "purple",
      durationMinutes: Math.round(32 * peakFactor),
      distanceKm:      15.1,
      costRupees:      280,
      mode:            "cab",
      crowdLevel:      18,
      weather:         "Excellent",
      steps: [
        { mode: "cab", icon: "🚕", desc: "Direct cab — door to door", duration: `${Math.round(32 * peakFactor)} min` },
      ],
    },
  ];

  // Attach carbon metrics + AI score to each route
  return routes.map(r => {
    const carbon = calculateTripCarbon(r.mode, r.distanceKm);
    const aiScore = scoreRoute(r, carbon, isPeak, prefs);
    return {
      ...r,
      co2Kg:        carbon.co2Emitted,
      co2SavedKg:   carbon.co2Saved,
      moneySaved:   carbon.moneySaved,
      fuelSaved:    carbon.fuelSaved,
      carbon:       `${carbon.co2Emitted} kg CO₂`,
      crowd:        r.crowdLevel > 70 ? "High" : r.crowdLevel > 45 ? "Moderate" : "Low",
      duration:     `${Math.round(r.durationMinutes)} min`,
      cost:         `₹${r.costRupees}`,
      aiScore,
    };
  }).sort((a, b) => b.aiScore - a.aiScore);
};

/**
 * scoreRoute — multi-factor AI scoring (0–100)
 * Weights: time 30% · cost 20% · carbon 25% · crowd 15% · weather 10%
 */
const scoreRoute = (route, carbon, isPeak, prefs = []) => {
  const timeScore    = Math.max(0, 100 - route.durationMinutes);
  const costScore    = Math.max(0, 100 - route.costRupees / 3);
  const carbonScore  = Math.max(0, 100 - carbon.co2Emitted * 60);
  const crowdScore   = 100 - route.crowdLevel;
  const weatherScore = route.weather === "Excellent" ? 100 : route.weather === "Safe" ? 80 : 50;

  let score = (
    timeScore    * 0.30 +
    costScore    * 0.20 +
    carbonScore  * 0.25 +
    crowdScore   * 0.15 +
    weatherScore * 0.10
  );

  // Preference boosts
  if (prefs.includes("Avoid highways") && route.mode !== "cab") score += 3;
  if (prefs.includes("Wheelchair accessible") && route.mode === "metro") score += 5;

  return Math.round(Math.min(100, Math.max(0, score)));
};

module.exports = { generateRouteOptions };
