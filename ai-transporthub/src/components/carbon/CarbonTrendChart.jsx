/**
 * CarbonTrendChart — 8-week CO₂ emitted vs saved stacked area chart
 */
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { CARBON_MONTHLY } from "../../utils/mockData";

const data = CARBON_MONTHLY.labels.map((label, i) => ({
  label,
  Emitted: CARBON_MONTHLY.emitted[i],
  Saved:   CARBON_MONTHLY.saved[i],
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg px-3 py-2 text-xs space-y-1">
      <p className="font-bold text-slate-700 dark:text-slate-200">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.stroke }}>{p.name}: <strong>{p.value} kg CO₂</strong></p>
      ))}
    </div>
  );
};

export default function CarbonTrendChart() {
  const totalSaved   = CARBON_MONTHLY.saved.reduce((a, b) => a + b, 0).toFixed(1);
  const latestSaved  = CARBON_MONTHLY.saved.at(-1);
  const prevSaved    = CARBON_MONTHLY.saved.at(-2);
  const trendPct     = (((latestSaved - prevSaved) / prevSaved) * 100).toFixed(0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BarChart3 size={17} className="text-green-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">8-week carbon trend</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500">Total saved: <strong className="text-green-600">{totalSaved} kg</strong></span>
          <span className={`font-bold px-2 py-0.5 rounded-full ${+trendPct >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {+trendPct >= 0 ? "▲" : "▼"} {Math.abs(trendPct)}% this week
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-4">Emitted vs saved vs a solo car baseline</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gEmit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gSave" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit=" kg" width={42} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Area type="monotone" dataKey="Emitted" stroke="#f59e0b" strokeWidth={2} fill="url(#gEmit)" />
          <Area type="monotone" dataKey="Saved"   stroke="#22c55e" strokeWidth={2} fill="url(#gSave)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
