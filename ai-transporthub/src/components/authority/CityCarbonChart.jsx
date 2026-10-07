/**
 * CityCarbonChart — city-wide CO2 saved vs daily target bar chart
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer } from "recharts";
import { Leaf } from "lucide-react";
import { CITY_CO2_WEEKLY } from "../../utils/mockData";

const data = CITY_CO2_WEEKLY.labels.map((day, i) => ({
  day,
  "CO₂ Saved (t)": CITY_CO2_WEEKLY.actual[i],
  "Daily Target":   CITY_CO2_WEEKLY.target[i],
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const saved  = payload.find(p => p.name === "CO₂ Saved (t)")?.value;
  const target = payload.find(p => p.name === "Daily Target")?.value;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg px-3 py-2 text-xs space-y-1">
      <p className="font-bold text-slate-700 dark:text-slate-200">{label}</p>
      <p className="text-green-600">Saved: <strong>{saved} tonnes</strong></p>
      <p className="text-slate-400">Target: {target} tonnes</p>
      <p className={`font-semibold ${saved >= target ? "text-green-600" : "text-red-500"}`}>
        {saved >= target ? `✓ Target met (+${(saved - target).toFixed(1)}t)` : `✗ ${(target - saved).toFixed(1)}t below target`}
      </p>
    </div>
  );
};

export default function CityCarbonChart() {
  const total  = CITY_CO2_WEEKLY.actual.reduce((a, b) => a + b, 0).toFixed(1);
  const metDays = CITY_CO2_WEEKLY.actual.filter((v, i) => v >= CITY_CO2_WEEKLY.target[i]).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Leaf size={17} className="text-green-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">City CO₂ reduction this week</h3>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-slate-500">Total: <strong className="text-green-600">{total} tonnes</strong></span>
          <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">{metDays}/7 targets met</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-4">Tonnes CO₂ saved vs 10t daily target (weekdays) / 7t (weekends)</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={22} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="t" width={36} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.1)" }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="CO₂ Saved (t)" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Daily Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
