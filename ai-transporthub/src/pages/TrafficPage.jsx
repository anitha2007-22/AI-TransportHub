/**
 * TrafficPage — Phase 3: Traffic Intelligence Module
 * Sections: metric strip · AI briefing · heatmap · 24h chart · zone table · incidents
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Map, BarChart3, AlertTriangle, Navigation } from "lucide-react";
import TrafficMetricBar  from "../components/traffic/TrafficMetricBar";
import AITrafficInsight  from "../components/traffic/AITrafficInsight";
import HeatMap           from "../components/traffic/HeatMap";
import CongestionChart   from "../components/traffic/CongestionChart";
import ZoneTable         from "../components/traffic/ZoneTable";
import IncidentFeed      from "../components/traffic/IncidentFeed";

const TABS = [
  { id: "map",       label: "Heatmap",    icon: Map },
  { id: "chart",     label: "24h Forecast", icon: BarChart3 },
  { id: "zones",     label: "Zones",       icon: Activity },
  { id: "incidents", label: "Incidents",   icon: AlertTriangle },
];

const INCIDENT_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "resolved", label: "Resolved" },
];

export default function TrafficPage() {
  const [activeTab, setActiveTab]         = useState("map");
  const [incidentFilter, setIncidentFilter] = useState("all");
  const navigate = useNavigate();

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Traffic Intelligence</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Live congestion · AI-predicted hotspots · Incident alerts
          </p>
        </div>
        <button
          onClick={() => navigate("/planner")}
          className="btn-primary flex items-center gap-2 text-sm py-2"
        >
          <Navigation size={15} /> Plan around traffic
        </button>
      </div>

      {/* KPI strip */}
      <TrafficMetricBar />

      {/* AI briefing */}
      <AITrafficInsight />

      {/* Tab navigation */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="animate-fade-in">
        {activeTab === "map" && <HeatMap />}

        {activeTab === "chart" && (
          <div className="space-y-4">
            <CongestionChart />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { time: "Morning peak", hours: "7:30–9:30 AM", level: 88, tip: "Leave before 7 AM or after 10 AM" },
                { time: "Midday lull",  hours: "11 AM–1 PM",   level: 62, tip: "Best time to run errands" },
                { time: "Evening peak", hours: "5:30–7:30 PM", level: 91, tip: "Work remotely or leave before 4:30 PM" },
              ].map(item => (
                <div key={item.time} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.time}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{item.hours}</p>
                  <div className="my-2 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.level >= 80 ? "bg-red-500" : item.level >= 60 ? "bg-amber-400" : "bg-green-500"}`}
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.level}% congestion · {item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "zones" && <ZoneTable />}

        {activeTab === "incidents" && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex gap-2">
              {INCIDENT_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setIncidentFilter(f.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    incidentFilter === f.id
                      ? "bg-primary-600 text-white border-primary-600"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <IncidentFeed filter={incidentFilter} />
          </div>
        )}
      </div>
    </div>
  );
}
