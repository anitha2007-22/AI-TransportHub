/**
 * AnalyticsPage — Phase 6: Authority Analytics Dashboard
 * KPIs · peak hours chart · popular routes · transport feed · city carbon
 */
import { Car, Users, BarChart3, Leaf, AlertTriangle, CheckCircle, Flag, Zap } from "lucide-react";
import MetricCard        from "../components/dashboard/MetricCard";
import HeatMap           from "../components/traffic/HeatMap";
import PeakHoursChart    from "../components/authority/PeakHoursChart";
import PopularRoutesTable from "../components/authority/PopularRoutesTable";
import TransportFeed     from "../components/authority/TransportFeed";
import CityCarbonChart   from "../components/authority/CityCarbonChart";
import { AUTHORITY_METRICS, EXISTING_REPORTS } from "../utils/mockData";

export default function AnalyticsPage() {
  const m = AUTHORITY_METRICS;
  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Authority Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">City-wide mobility intelligence · Chennai Metropolitan Area</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Car}           label="Total trips today"         value={m.totalTripsToday.toLocaleString()} trend={6}   color="primary" />
        <MetricCard icon={Users}         label="Public transit share"      value={`${m.publicTransitShare}%`}         trend={5}   color="green" />
        <MetricCard icon={BarChart3}     label="Avg city congestion"       value={`${m.avgCongestion}%`}              trend={-4}  color="amber" />
        <MetricCard icon={Leaf}          label="CO₂ saved today"           value={`${m.co2SavedTonnes}t`}             trend={18}  color="green" />
        <MetricCard icon={AlertTriangle} label="Active incidents"          value={m.activeIncidents}                  sub="Requires attention" color="red" />
        <MetricCard icon={CheckCircle}   label="Incidents resolved today"  value={m.resolvedToday}                    trend={20}  color="green" />
        <MetricCard icon={Flag}          label="Citizen reports pending"   value={m.citizenReports}                   sub="Avg response: 18 min" color="amber" />
        <MetricCard icon={Zap}           label="AI routes optimised"       value={m.routesOptimised.toLocaleString()} trend={12}  color="purple" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PeakHoursChart />
        <CityCarbonChart />
      </div>

      {/* Heatmap full-width */}
      <HeatMap />

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <PopularRoutesTable />
        </div>
        <div className="lg:col-span-2">
          <TransportFeed />
        </div>
      </div>

      {/* Citizen reports quick view */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Pending citizen reports</h3>
          <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-full font-medium">
            {EXISTING_REPORTS.filter(r => r.status !== "resolved").length} active
          </span>
        </div>
        <div className="space-y-2">
          {EXISTING_REPORTS.filter(r => r.status !== "resolved").map(r => {
            const STATUS = {
              pending:       "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
              acknowledged:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              investigating: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            };
            return (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="text-xl flex-shrink-0">
                  {["🚨","🕳️","🌊","🚦","🚗"][r.id - 1] || "📋"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{r.location}</p>
                  <p className="text-xs text-slate-400">{r.time} · {r.votes} confirmations</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS[r.status]}`}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
                <button className="text-xs text-primary-600 font-medium hover:underline flex-shrink-0">
                  Respond
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
