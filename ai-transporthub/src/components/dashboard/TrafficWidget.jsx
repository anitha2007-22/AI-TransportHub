/**
 * TrafficWidget — live traffic status list with congestion bars
 */
import { Activity, ArrowRight } from "lucide-react";
import { TRAFFIC_DATA } from "../../utils/mockData";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  light:    { bar: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50 dark:bg-green-900/20",  label: "Light" },
  moderate: { bar: "bg-amber-500",  text: "text-amber-700",  bg: "bg-amber-50 dark:bg-amber-900/20",  label: "Moderate" },
  heavy:    { bar: "bg-red-500",    text: "text-red-700",    bg: "bg-red-50 dark:bg-red-900/20",      label: "Heavy" },
};

export default function TrafficWidget() {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Live Traffic</h3>
        </div>
        <button onClick={() => navigate("/traffic")} className="text-xs text-primary-600 flex items-center gap-1 hover:gap-2 transition-all font-medium">
          View all <ArrowRight size={13} />
        </button>
      </div>
      <div className="space-y-3">
        {TRAFFIC_DATA.current.map((item, i) => {
          const s = STATUS_STYLES[item.status];
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate pr-4">{item.route}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${s.bar} rounded-full transition-all duration-700`} style={{ width: `${item.congestion}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
