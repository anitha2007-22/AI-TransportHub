/**
 * MetricCard — reusable stat card with icon, value, trend
 */
export default function MetricCard({ icon: Icon, label, value, sub, trend, color = "primary", onClick }) {
  const colors = {
    primary: { bg: "bg-primary-50 dark:bg-primary-900/20", icon: "text-primary-600 dark:text-primary-400", badge: "bg-primary-100 text-primary-700" },
    green:   { bg: "bg-green-50 dark:bg-green-900/20",   icon: "text-green-600 dark:text-green-400",   badge: "bg-green-100 text-green-700" },
    amber:   { bg: "bg-amber-50 dark:bg-amber-900/20",   icon: "text-amber-600 dark:text-amber-400",   badge: "bg-amber-100 text-amber-700" },
    red:     { bg: "bg-red-50 dark:bg-red-900/20",       icon: "text-red-600 dark:text-red-400",       badge: "bg-red-100 text-red-700" },
    purple:  { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 text-purple-700" },
  };
  const c = colors[color] || colors.primary;

  return (
    <div onClick={onClick} className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? "cursor-pointer hover:-translate-y-0.5" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}
