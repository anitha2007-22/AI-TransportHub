/**
 * AdminTransportPage — manage transport data, routes, and API integrations
 */
import { useState } from "react";
import { Train, Bus, Plus, RefreshCw, CheckCircle, AlertTriangle, Settings2, Plug } from "lucide-react";
import { TRANSPORT_FEED } from "../utils/mockData";
import toast from "react-hot-toast";

const API_INTEGRATIONS = [
  { id: "google_maps",  name: "Google Maps API",         status: "connected",    desc: "Directions, geocoding, and live traffic",   icon: "🗺️" },
  { id: "openweather",  name: "OpenWeatherMap",          status: "connected",    desc: "Real-time weather and rain forecasts",       icon: "🌤️" },
  { id: "govt_traffic", name: "TN Govt Traffic Feed",    status: "disconnected", desc: "Official Tamil Nadu traffic data stream",    icon: "🚦" },
  { id: "metro_api",    name: "CMRL Metro GTFS Feed",    status: "simulated",    desc: "Metro schedules and real-time positions",    icon: "🚇" },
  { id: "mtc_api",      name: "MTC Bus GTFS Feed",       status: "simulated",    desc: "Bus route data and live positions",          icon: "🚌" },
  { id: "firebase",     name: "Firebase Notifications",  status: "connected",    desc: "Push notifications to mobile devices",       icon: "🔔" },
];

const STATUS_STYLE = {
  connected:    { label: "Connected",    bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" },
  disconnected: { label: "Disconnected", bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",         dot: "bg-red-500" },
  simulated:    { label: "Simulated",    bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
};

const ROUTES_DATA = [
  { id: "GRN", name: "Metro Green Line",  stops: 19, freq: "4 min", active: true,  passengers: 28400 },
  { id: "BLU", name: "Metro Blue Line",   stops: 15, freq: "6 min", active: true,  passengers: 21200 },
  { id: "23C", name: "Bus Route 23C",     stops: 28, freq: "12 min", active: true, passengers: 8600 },
  { id: "47A", name: "Bus Route 47A",     stops: 22, freq: "15 min", active: true, passengers: 6400 },
  { id: "12B", name: "Bus Route 12B",     stops: 31, freq: "10 min", active: false, passengers: 0 },
];

export default function AdminTransportPage() {
  const [routes, setRoutes] = useState(ROUTES_DATA);
  const [integrations, setIntegrations] = useState(API_INTEGRATIONS);
  const [syncing, setSyncing] = useState(false);

  const toggleRoute = (id) => {
    setRoutes(rs => rs.map(r => r.id === id ? { ...r, active: !r.active } : r));
    const r = routes.find(r => r.id === id);
    toast.success(`Route ${r.name} ${r.active ? "deactivated" : "activated"}`);
  };

  const sync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setSyncing(false);
    toast.success("Transport data synced successfully");
  };

  const connectApi = (id) => {
    setIntegrations(is => is.map(i => i.id === id ? { ...i, status: i.status === "connected" ? "disconnected" : "connected" } : i));
    const api = integrations.find(i => i.id === id);
    toast.success(api.status === "connected" ? `${api.name} disconnected` : `${api.name} connected`);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Train size={21} className="text-primary-600" /> Transport Data Manager
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage routes, schedules, and external API integrations.</p>
        </div>
        <button onClick={sync} disabled={syncing}
          className="btn-primary flex items-center gap-2 text-sm py-2 disabled:opacity-60">
          <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing…" : "Sync all data"}
        </button>
      </div>

      {/* API Integrations */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Plug size={16} className="text-primary-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">API Integrations</h3>
          <span className="ml-auto text-xs text-slate-400">
            {integrations.filter(i => i.status === "connected").length}/{integrations.length} connected
          </span>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {integrations.map(api => {
            const s = STATUS_STYLE[api.status];
            return (
              <div key={api.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <span className="text-2xl flex-shrink-0">{api.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{api.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{api.desc}</p>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} flex-shrink-0`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </div>
                <button onClick={() => connectApi(api.id)}
                  className="text-xs font-medium text-primary-600 hover:underline flex-shrink-0 ml-2">
                  {api.status === "connected" ? "Disconnect" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-800 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Simulated feeds</strong> are using demo data. Connect official CMRL/MTC GTFS feeds to switch to live data.
          </p>
        </div>
      </div>

      {/* Active routes table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus size={16} className="text-green-600" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Routes & schedules</h3>
          </div>
          <button onClick={() => toast.success("Add route form coming soon")}
            className="flex items-center gap-1.5 text-xs text-primary-600 font-medium hover:underline">
            <Plus size={13} /> Add route
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                {["ID","Route name","Stops","Frequency","Daily riders","Status","Toggle"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {routes.map(r => (
                <tr key={r.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${!r.active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{r.stops}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{r.freq}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">{r.active ? r.passengers.toLocaleString() : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {r.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleRoute(r.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${r.active ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-700"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${r.active ? "left-5" : "left-0.5"}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live feed preview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Live feed preview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRANSPORT_FEED.map(t => (
            <div key={t.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3">
              <span className="text-xl">{t.type === "metro" ? "🚇" : "🚌"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{t.line}</p>
                <p className="text-[10px] text-slate-400">{t.passengers} pax · {t.lastUpdate}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.status === "on-time" ? "text-green-600 bg-green-100" : "text-amber-600 bg-amber-100"}`}>
                {t.status === "on-time" ? "OK" : t.delay}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
