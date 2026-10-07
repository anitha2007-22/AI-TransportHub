/**
 * CarbonChart — weekly CO2 saved vs emitted bar chart using Recharts
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Leaf } from "lucide-react";
import { CARBON_WEEKLY } from "../../utils/mockData";

const data = CARBON_WEEKLY.labels.map((day, i) => ({
  day,
  Saved: CARBON_WEEKLY.saved[i],
  Emitted: CARBON_WEEKLY.emitted[i],
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value} kg CO₂</p>
      ))}
    </div>
  );
};

export default function CarbonChart() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Leaf size={18} className="text-green-600" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Weekly Carbon Report</h3>
        <span className="ml-auto text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">-13.4 kg saved</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={10} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit=" kg" width={42} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.1)" }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="Saved" fill="#22c55e" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Emitted" fill="#f59e0b" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
