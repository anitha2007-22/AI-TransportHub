/**
 * TrafficMetricBar — top stat strip: 4 at-a-glance traffic KPIs
 */
import { Car, AlertTriangle, Clock, TrendingDown } from "lucide-react";

const METRICS = [
  { icon: Car,          label: "Active vehicles",     value: "42,350",  sub: "In Chennai metro area",   color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
  { icon: AlertTriangle,label: "Active incidents",    value: "4",       sub: "2 critical · 2 medium",   color: "text-red-600",     bg: "bg-red-50 dark:bg-red-900/20" },
  { icon: Clock,        label: "Avg delay (city)",    value: "+18 min", sub: "vs. free-flow baseline",  color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20" },
  { icon: TrendingDown, label: "Congestion vs. yesterday", value: "-4%",sub: "Improving trend",         color: "text-green-600",   bg: "bg-green-50 dark:bg-green-900/20" },
];

export default function TrafficMetricBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map(({ icon: Icon, label, value, sub, color, bg }) => (
        <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
            <Icon size={18} className={color} />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
        </div>
      ))}
    </div>
  );
}
