/**
 * TransportFeed — live status of metro lines and bus routes
 */
import { Train, Bus, CheckCircle, AlertTriangle, Navigation } from "lucide-react";
import { TRANSPORT_FEED } from "../../utils/mockData";

const STATUS_STYLE = {
  "on-time":  { label: "On Time",  color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" },
  "delayed":  { label: "Delayed",  color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500 animate-pulse" },
  "diverted": { label: "Diverted", color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400", dot: "bg-orange-500 animate-pulse" },
  "cancelled":{ label: "Cancelled",color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",   dot: "bg-red-500" },
};

export default function TransportFeed() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Live transport feed</h3>
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {TRANSPORT_FEED.map(t => {
          const s = STATUS_STYLE[t.status];
          const Icon = t.type === "metro" ? Train : Bus;
          return (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === "metro" ? "bg-primary-100 dark:bg-primary-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                <Icon size={16} className={t.type === "metro" ? "text-primary-600" : "text-green-600"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.line}</p>
                  <span className="text-[10px] font-medium text-slate-400">{t.id}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </div>
                  {t.delay && <span className="text-xs text-slate-500">{t.delay}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.passengers.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">passengers</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
