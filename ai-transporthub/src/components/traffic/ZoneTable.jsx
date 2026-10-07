/**
 * ZoneTable — per-area congestion summary with trend indicators and progress bars
 */
import { ZONE_CONGESTION } from "../../utils/mockData";

const barColor = l => l >= 80 ? "bg-red-500" : l >= 60 ? "bg-orange-400" : l >= 40 ? "bg-amber-400" : "bg-green-500";
const textColor = l => l >= 80 ? "text-red-600 dark:text-red-400" : l >= 60 ? "text-orange-600 dark:text-orange-400" : l >= 40 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400";
const levelLabel = l => l >= 80 ? "Heavy" : l >= 60 ? "Moderate" : l >= 40 ? "Slow" : "Clear";

export default function ZoneTable() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Congestion by zone</h3>
        <p className="text-xs text-slate-400 mt-0.5">Updated every 2 minutes · ▲ = worsening · ▼ = improving</p>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {ZONE_CONGESTION.map(z => (
          <div key={z.zone} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="w-28 flex-shrink-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{z.zone}</p>
              <p className="text-xs text-slate-400">Peak: {z.peakHour}</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-semibold ${textColor(z.level)}`}>{z.level}% — {levelLabel(z.level)}</span>
                <span className={`text-[11px] font-bold ${z.trend > 0 ? "text-red-500" : z.trend < 0 ? "text-green-500" : "text-slate-400"}`}>
                  {z.trend > 0 ? `▲ +${z.trend}%` : z.trend < 0 ? `▼ ${z.trend}%` : "→ stable"}
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${barColor(z.level)} rounded-full transition-all duration-700`} style={{ width: `${z.level}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
