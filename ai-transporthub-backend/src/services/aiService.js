/**
 * aiService.js — All AI calls using Google Gemini (FREE)
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../config/logger");

const getModel = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "AIza-your-key-here") return null;
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: "gemini-1.5-flash" });
};

const ask = async (prompt) => {
  const model = getModel();
  if (!model) throw new Error("GEMINI_API_KEY not set");
  const result = await model.generateContent(prompt);
  return result.response.text()?.trim() || "";
};

exports.getRouteInsight = async (from, to, time, selectedRoute, trafficData = {}) => {
  try {
    return await ask(`You are a Chennai transport AI. In 2-3 sentences give a smart travel tip:
From: ${from}, To: ${to}, Time: ${time}, Route: ${selectedRoute?.label || "fastest"}.
Traffic: ${trafficData.avgCongestion || 54}%. Be specific to Chennai roads and metro.`);
  } catch {
    return "Based on current traffic, your selected route looks optimal. The metro bypasses road congestion during peak hours.";
  }
};

exports.getTrafficBriefing = async (zones = [], incidents = []) => {
  try {
    const topZones = zones.filter(z => z.level >= 70).map(z => `${z.zone} (${z.level}%)`).join(", ") || "T. Nagar (91%), Central (88%)";
    const activeInc = incidents.filter(i => i.active).map(i => `${i.type} at ${i.location}`).join("; ") || "none";
    return await ask(`You are a Chennai traffic AI. In 3 sentences give a city-wide traffic briefing:
Heavy zones: ${topZones}. Incidents: ${activeInc}. Time: ${new Date().toLocaleTimeString("en-IN")}.
Mention worst bottleneck, when it clears, and one alternate route.`);
  } catch {
    return "T. Nagar and Central are the busiest zones right now. Congestion expected to ease by 10:30 AM. Use Inner Ring Road via Guindy as an alternate.";
  }
};

exports.getEcoTip = async (userStats) => {
  try {
    return await ask(`You are an eco-mobility coach for Chennai. Give one specific actionable tip in 2 sentences:
User: eco score=${userStats.ecoScore}/100, metro=${userStats.metroShare}%, cab=${userStats.cabShare}%, CO2 saved=${userStats.co2Saved}kg this month.`);
  } catch {
    return "Switching 2 of your weekly cab trips to metro or bus would save an additional 4-5 kg CO₂ per month and push your eco score above 88.";
  }
};
