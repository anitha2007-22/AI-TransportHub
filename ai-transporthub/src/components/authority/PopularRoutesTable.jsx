/**
 * PopularRoutesTable — top city routes by daily trip volume with trend
 */
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { POPULAR_ROUTES } from "../../utils/mockData";

export default function PopularRoutesTable() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Popular routes today</h3>
        <p className="text-xs text-slate-400 mt-0.5">Ranked by daily trip volume · % of city capacity used</p>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {POPULAR_ROUTES.map((r, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <span className="w-6 text-xs font-bold text-slate-400 flex-shrink-0">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{r.route}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.pct > 80 ? "bg-red-500" : r.pct > 60 ? "bg-amber-400" : "bg-primary-500"}`}
                    style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{r.pct}%</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{r.trips.toLocaleString()}</p>
              <div className={`flex items-center justify-end gap-0.5 text-xs font-semibold mt-0.5 ${r.trend > 0 ? "text-red-500" : r.trend < 0 ? "text-green-500" : "text-slate-400"}`}>
                {r.trend > 0 ? <TrendingUp size={11} /> : r.trend < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
                {r.trend > 0 ? `+${r.trend}%` : r.trend < 0 ? `${r.trend}%` : "stable"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
