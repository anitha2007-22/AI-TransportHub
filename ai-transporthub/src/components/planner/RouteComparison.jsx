/**
 * RouteComparison — visual comparison table for all route options
 */
import { Clock, IndianRupee, Leaf, Users, Shield, Sparkles } from "lucide-react";

const METRICS = [
  { key: "duration", label: "Travel time", icon: Clock },
  { key: "cost",     label: "Estimated cost", icon: IndianRupee },
  { key: "carbon",   label: "CO₂ emission", icon: Leaf },
  { key: "crowd",    label: "Crowd level", icon: Users },
  { key: "weather",  label: "Weather safety", icon: Shield },
];

export default function RouteComparison({ routes, selectedId, onSelect }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Sparkles size={14} className="text-primary-600" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Route comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-50 dark:border-slate-800">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Metric</th>
              {routes.map(r => (
                <th key={r.id} className="px-3 py-2.5 text-center">
                  <button onClick={() => onSelect(r.id)}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${selectedId === r.id ? "bg-primary-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                    {r.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map(({ key, label, icon: Icon }) => (
              <tr key={key} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Icon size={13} className="text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                  </div>
                </td>
                {routes.map(r => (
                  <td key={r.id} className={`px-3 py-2.5 text-center text-xs font-medium ${selectedId === r.id ? "text-primary-700 dark:text-primary-400" : "text-slate-700 dark:text-slate-300"}`}>
                    {r[key]}
                  </td>
                ))}
              </tr>
            ))}
            {/* AI Score row */}
            <tr className="bg-primary-50/40 dark:bg-primary-900/10">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-primary-500" />
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold">AI Score</span>
                </div>
              </td>
              {routes.map(r => (
                <td key={r.id} className="px-3 py-2.5 text-center">
                  <span className={`text-xs font-bold ${r.aiScore >= 88 ? "text-green-600" : r.aiScore >= 75 ? "text-amber-600" : "text-slate-500"}`}>
                    {r.aiScore}/100
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
