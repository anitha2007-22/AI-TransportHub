/**
 * TripHistoryTable — scrollable log of recent trips with per-trip emissions
 */
import { ArrowRight, Leaf, TrendingUp } from "lucide-react";
import { TRIP_HISTORY } from "../../utils/mockData";

const MODE_ICON = { metro: "🚇", bus: "🚌", cab: "🚕", car: "🚗", walk: "🚶", cycle: "🚲", autoRickshaw: "🛺", bike: "🏍️" };
const MODE_COLOR = {
  metro: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
  bus:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cab:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  walk:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cycle: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  autoRickshaw: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function TripHistoryTable() {
  const totalSaved = TRIP_HISTORY.reduce((s, t) => s + t.moneySaved, 0);
  const totalCo2   = TRIP_HISTORY.reduce((s, t) => s + t.co2, 0).toFixed(2);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-primary-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Recent trips</h3>
        </div>
        <div className="flex gap-3 text-xs text-slate-500">
          <span>Total CO₂: <strong className="text-slate-800 dark:text-slate-200">{totalCo2} kg</strong></span>
          <span>Money saved: <strong className="text-green-600">₹{totalSaved}</strong></span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              {["Date", "Route", "Mode", "Distance", "CO₂", "Saved"].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {TRIP_HISTORY.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{t.date.slice(5)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-medium truncate max-w-[80px]">{t.from}</span>
                    <ArrowRight size={10} className="text-slate-400 flex-shrink-0" />
                    <span className="font-medium truncate max-w-[80px]">{t.to}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${MODE_COLOR[t.mode] || "bg-slate-100 text-slate-600"}`}>
                    <span>{MODE_ICON[t.mode] || "🚗"}</span>
                    <span className="capitalize">{t.mode}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{t.km} km</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${t.co2 < 0.8 ? "text-green-600" : t.co2 < 1.2 ? "text-amber-600" : "text-red-600"}`}>
                    {t.co2} kg
                  </span>
                </td>
                <td className="px-4 py-3">
                  {t.moneySaved > 0
                    ? <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 font-medium"><Leaf size={10} />₹{t.moneySaved}</span>
                    : <span className="text-xs text-slate-300 dark:text-slate-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
