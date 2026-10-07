/**
 * PeakHoursChart — multi-day traffic volume heatmap by hour
 * Uses Recharts LineChart with day toggles
 */
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";
import { PEAK_HOURS_DATA } from "../../utils/mockData";

const DAYS = [
  { key: "mon", label: "Mon", color: "#2563eb" },
  { key: "tue", label: "Tue", color: "#7c3aed" },
  { key: "wed", label: "Wed", color: "#16a34a" },
  { key: "thu", label: "Thu", color: "#d97706" },
  { key: "fri", label: "Fri", color: "#dc2626" },
];

const data = PEAK_HOURS_DATA.labels.map((h, i) => ({
  hour: h,
  mon: PEAK_HOURS_DATA.mon[i],
  tue: PEAK_HOURS_DATA.tue[i],
  wed: PEAK_HOURS_DATA.wed[i],
  thu: PEAK_HOURS_DATA.thu[i],
  fri: PEAK_HOURS_DATA.fri[i],
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg px-3 py-2 text-xs space-y-1">
      <p className="font-bold text-slate-700 dark:text-slate-200">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name.toUpperCase()}: <strong>{p.value}%</strong></p>
      ))}
    </div>
  );
};

export default function PeakHoursChart() {
  const [active, setActive] = useState(["mon", "tue", "wed", "thu", "fri"]);
  const toggle = key => setActive(a => a.includes(key) ? a.filter(d => d !== key) : [...a, key]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Clock size={17} className="text-primary-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Peak hours — congestion by day</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map(d => (
            <button key={d.key} onClick={() => toggle(d.key)}
              className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${active.includes(d.key) ? "text-white border-transparent" : "bg-transparent text-slate-400 border-slate-200 dark:border-slate-700"}`}
              style={active.includes(d.key) ? { background: d.color, borderColor: d.color } : {}}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={2} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          {DAYS.filter(d => active.includes(d.key)).map(d => (
            <Line key={d.key} type="monotone" dataKey={d.key} stroke={d.color}
              strokeWidth={2} dot={false} activeDot={{ r: 4 }} name={d.label} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
