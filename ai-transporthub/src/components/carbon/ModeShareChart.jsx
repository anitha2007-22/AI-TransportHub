/**
 * ModeShareChart — donut chart of transport mode usage (Recharts PieChart)
 */
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Bike } from "lucide-react";
import { MODE_SHARE } from "../../utils/mockData";

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-slate-800 dark:text-slate-200">{d.name}</p>
      <p className="text-slate-500">Share: <strong>{d.value}%</strong></p>
      <p className="text-slate-500">CO₂ level: <strong>{d.co2}</strong></p>
    </div>
  );
};

export default function ModeShareChart() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Bike size={17} className="text-primary-600" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Your mode share (this month)</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={MODE_SHARE} cx="50%" cy="50%"
            innerRadius={55} outerRadius={90}
            dataKey="value" labelLine={false} label={<CustomLabel />}>
            {MODE_SHARE.map(entry => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle" iconSize={8}
            formatter={v => <span className="text-xs text-slate-600 dark:text-slate-400">{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Insight callout */}
      <div className="mt-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2.5 flex items-start gap-2">
        <span className="text-base flex-shrink-0">💡</span>
        <p className="text-xs text-green-700 dark:text-green-400">
          <strong>70% of your trips</strong> are low-emission (metro + bus + walk). Replacing cab trips with auto or bus could boost your eco score by ~8 points.
        </p>
      </div>
    </div>
  );
}
