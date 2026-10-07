/**
 * carbonService.js — CO₂ emission calculations using IPCC/DEFRA factors
 * Used by trip controller to auto-compute carbon metrics on every trip
 */

// kg CO₂ per km — real IPCC/DEFRA 2023 values
const EMISSION_FACTORS = {
  car:          0.171,
  cab:          0.171,
  bus:          0.089,
  metro:        0.041,
  autoRickshaw: 0.097,
  bike:         0.035,  // motorbike
  cycle:        0.000,
  walk:         0.000,
};

// Cost per km in INR (approximate Chennai rates)
const COST_PER_KM = {
  car:          6.5,
  cab:          14.0,
  bus:          0.9,
  metro:        2.1,
  autoRickshaw: 7.0,
  bike:         2.8,
  cycle:        0.0,
  walk:         0.0,
};

const CAR_BASELINE_COST    = 14.0;  // cab as the "if not using eco mode" baseline
const CAR_BASELINE_EMISSION = EMISSION_FACTORS.car;
const LITRES_PER_KG_CO2    = 1 / 2.31; // 1 litre petrol ≈ 2.31 kg CO₂

/**
 * calculateTripCarbon
 * @param {string} mode       - transport mode key
 * @param {number} distanceKm - trip distance
 * @param {number} trips      - number of trips (default 1)
 * @returns {Object} carbon metrics
 */
const calculateTripCarbon = (mode, distanceKm, trips = 1) => {
  const factor      = EMISSION_FACTORS[mode] ?? EMISSION_FACTORS.car;
  const totalKm     = distanceKm * trips;

  const co2Emitted  = +(factor * totalKm).toFixed(3);
  const carCo2      = +(CAR_BASELINE_EMISSION * totalKm).toFixed(3);
  const co2Saved    = +(Math.max(0, carCo2 - co2Emitted)).toFixed(3);
  const fuelSaved   = +(co2Saved * LITRES_PER_KG_CO2).toFixed(3);

  const modeCost    = +(COST_PER_KM[mode] ?? 0) * totalKm;
  const carCost     = +CAR_BASELINE_COST * totalKm;
  const moneySaved  = +(Math.max(0, carCost - modeCost)).toFixed(0);

  const treesEquiv  = +(co2Saved / 10.8).toFixed(3); // 1 tree absorbs ~10.8 kg/year
  const ecoPercent  = carCo2 > 0 ? Math.round((co2Saved / carCo2) * 100) : 0;

  return {
    co2Emitted,
    co2Saved,
    fuelSaved,
    moneySaved: Number(moneySaved),
    treesEquiv,
    ecoPercent,
    modeCost: +modeCost.toFixed(0),
    carCost:  +carCost.toFixed(0),
  };
};

/**
 * calculateEcoScore
 * Score 0–100 based on weekly mode share and co2 savings
 * @param {Array} recentTrips - Trip documents from DB
 * @returns {number} eco score
 */
const calculateEcoScore = (recentTrips = []) => {
  if (!recentTrips.length) return 50;

  const lowEmoModes = ["metro", "bus", "cycle", "walk"];
  const lowEcoTrips = recentTrips.filter(t => lowEmoModes.includes(t.selectedRoute));
  const modeShare   = recentTrips.length > 0 ? lowEcoTrips.length / recentTrips.length : 0;

  const totalSaved  = recentTrips.reduce((s, t) => s + (t.co2SavedKg || 0), 0);
  const avgSaved    = totalSaved / recentTrips.length;

  // Weighted score: 60% mode share, 40% kg saved per trip
  const modeScore   = modeShare * 60;
  const savingScore = Math.min(avgSaved / 2.0, 1) * 40; // 2 kg/trip = max points

  return Math.round(Math.min(100, modeScore + savingScore + 30)); // +30 base points
};

module.exports = { calculateTripCarbon, calculateEcoScore, EMISSION_FACTORS, COST_PER_KM };
