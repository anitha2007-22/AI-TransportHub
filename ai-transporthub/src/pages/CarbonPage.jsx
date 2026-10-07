/**
 * CarbonPage — Phase 4: Carbon Footprint & Sustainability Module
 * Sections: summary strip · AI tip · eco score ring · charts · calculator · badges · leaderboard
 */
import { useState } from "react";
import { Leaf, Calculator, Trophy, BarChart3, History } from "lucide-react";
import EcoScoreRing    from "../components/carbon/EcoScoreRing";
import CarbonCalculator from "../components/carbon/CarbonCalculator";
import CarbonTrendChart from "../components/carbon/CarbonTrendChart";
import ModeShareChart   from "../components/carbon/ModeShareChart";
import TripHistoryTable from "../components/carbon/TripHistoryTable";
import EcoBadges        from "../components/carbon/EcoBadges";
import Leaderboard      from "../components/carbon/Leaderboard";
import AICarbonInsight  from "../components/carbon/AICarbonInsight";

const TABS = [
  { id: "overview",    label: "Overview",    icon: BarChart3 },
  { id: "calculator",  label: "Calculator",  icon: Calculator },
  { id: "history",     label: "Trip history", icon: History },
  { id: "achievements",label: "Achievements", icon: Trophy },
];

// Summary KPI strip
const SUMMARY_STATS = [
  { icon: "🌿", label: "CO₂ saved this month", value: "19.4 kg", sub: "vs solo car baseline",   color: "from-green-500 to-emerald-600" },
  { icon: "💰", label: "Money saved",           value: "₹2,840",  sub: "vs equivalent cab trips", color: "from-primary-500 to-primary-700" },
  { icon: "⛽", label: "Fuel equivalent saved", value: "8.4 L",   sub: "of petrol not burned",    color: "from-amber-500 to-orange-600" },
  { icon: "🌳", label: "Trees equivalent",      value: "1.8",     sub: "trees planted equivalent", color: "from-teal-500 to-green-600" },
];

export default function CarbonPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Leaf size={22} className="text-green-600" /> Carbon Footprint Tracker
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Track your emissions, savings, and sustainability impact.</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_STATS.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-md`}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-black mt-2 leading-none">{s.value}</p>
            <p className="text-xs font-medium text-white/80 mt-1">{s.label}</p>
            <p className="text-[10px] text-white/60 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* AI eco coach */}
      <AICarbonInsight />

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === id
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="animate-fade-in">
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-5">
              <EcoScoreRing />
              <Leaderboard />
            </div>
            <div className="lg:col-span-2 space-y-5">
              <CarbonTrendChart />
              <ModeShareChart />
            </div>
          </div>
        )}

        {tab === "calculator" && (
          <div className="max-w-2xl">
            <CarbonCalculator />
          </div>
        )}

        {tab === "history" && <TripHistoryTable />}

        {tab === "achievements" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <EcoBadges />
            <Leaderboard />
          </div>
        )}
      </div>
    </div>
  );
}
