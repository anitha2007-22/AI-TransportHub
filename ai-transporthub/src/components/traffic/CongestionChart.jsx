/**
 * CongestionChart — 24-hour traffic prediction with current-hour highlight
 * Uses Recharts AreaChart with a reference line at the current hour
 */
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { TRAFFIC_HOURLY } from "../../utils/mockData";

const currentHour = new Date().getHours();

const data = TRAFFIC_HOURLY.map((val, i) => ({
  hour: `${i}:00`,
  congestion: val,
  predicted: i > currentHour ? val : undefined,
  actual:    i <= currentHour ? val : undefined,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? payload[1]?.value;
  const isPredicted = label.split(":")[0] > currentHour;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      <p className={isPredicted ? "text-primary-500" : "text-slate-600 dark:text-slate-400"}>
        {isPredicted ? "Predicted" : "Actual"}: <strong>{val}%</strong>
      </p>
    </div>
  );
};

const levelLabel = v => v >= 75 ? "Heavy" : v >= 50 ? "Moderate" : "Light";
const levelColor = v => v >= 75 ? "text-red-600 bg-red-50 dark:bg-red-900/20" : v >= 50 ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20" : "text-green-600 bg-green-50 dark:bg-green-900/20";

export default function CongestionChart() {
  const now = TRAFFIC_HOURLY[currentHour];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp size={17} className="text-primary-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">24-hour congestion forecast</h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColor(now)}`}>
          Now: {now}% {levelLabel(now)}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Solid = recorded · Dashed = AI prediction · Red line = current hour
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
            interval={3} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
            domain={[0, 100]} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={`${currentHour}:00`} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2"
            label={{ value: "Now", position: "top", fontSize: 10, fill: "#ef4444" }} />
          <Area type="monotone" dataKey="actual"    stroke="#2563eb" strokeWidth={2} fill="url(#gradActual)" connectNulls />
          <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 3" fill="url(#gradPred)" connectNulls />
        </AreaChart>
      </ResponsiveContainer>

      {/* Peak hour callout */}
      <div className="mt-3 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2.5">
        <span className="text-lg">⚠️</span>
        <div>
          <p className="text-xs font-semibold text-red-700 dark:text-red-400">Peak congestion predicted 5–7 PM</p>
          <p className="text-xs text-red-600/80 dark:text-red-400/70">AI recommends leaving before 4:30 PM or after 7:30 PM to save ~25 min.</p>
        </div>
      </div>
    </div>
  );
}
