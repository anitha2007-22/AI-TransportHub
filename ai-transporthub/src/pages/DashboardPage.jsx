/**
 * DashboardPage — role-aware main dashboard
 * Commuter: personal metrics, trips, carbon, AI insight
 * Authority: city-level stats and heatmap summary
 */
import { useAuth } from "../context/AuthContext";
import MetricCard from "../components/dashboard/MetricCard";
import TrafficWidget from "../components/dashboard/TrafficWidget";
import WeatherWidget from "../components/dashboard/WeatherWidget";
import TodayTrips from "../components/dashboard/TodayTrips";
import CarbonChart from "../components/dashboard/CarbonChart";
import AIInsightBanner from "../components/dashboard/AIInsightBanner";
import { Car, Leaf, Clock, Zap, Users, BarChart3, AlertTriangle, MapPin } from "lucide-react";
import { CITY_STATS } from "../utils/mockData";
import { useNavigate } from "react-router-dom";

function CommuterDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Good morning, Arjun 👋</h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's your mobility summary for today.</p>
      </div>

      <AIInsightBanner />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Clock}  label="Avg travel time"   value="34 min" sub="Today's estimate" trend={-8}  color="primary" />
        <MetricCard icon={Car}    label="Cost today"        value="₹138"   sub="vs ₹195 cab avg"  trend={-29} color="green" />
        <MetricCard icon={Leaf}   label="CO₂ saved"         value="3.4 kg" sub="This week"         trend={12}  color="green" />
        <MetricCard icon={Zap}    label="Eco score"         value="82/100" sub="Top 12% in city"   trend={5}   color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <TodayTrips />
          <CarbonChart />
        </div>
        <div className="space-y-4">
          <WeatherWidget />
          <TrafficWidget />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Quick actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Plan trip", icon: MapPin, color: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400", to: "/planner" },
            { label: "Report issue", icon: AlertTriangle, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400", to: "/reports" },
            { label: "Carbon report", icon: Leaf, color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400", to: "/carbon" },
            { label: "Voice assist", icon: Zap, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400", to: "/voice" },
          ].map(({ label, icon: Icon, color, to }) => (
            <button key={label} onClick={() => navigate(to)} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthorityDashboard() {
  const s = CITY_STATS;
  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">City Operations Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time mobility intelligence for Chennai Metropolitan Area</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard icon={Car}      label="Active vehicles"         value={s.activeVehicles.toLocaleString()} trend={3}   color="primary" />
        <MetricCard icon={Users}    label="Public transport usage"  value={`${s.publicTransportUsage}%`}      trend={5}   color="green" />
        <MetricCard icon={BarChart3} label="Avg congestion level"   value={`${s.avgCongestion}%`}             trend={-4}  color="amber" />
        <MetricCard icon={Leaf}     label="CO₂ saved today"         value={`${s.co2SavedToday} tonnes`}       trend={18}  color="green" />
        <MetricCard icon={AlertTriangle} label="Citizen reports"    value={s.citizenReports}                  sub="Pending review" color="red" />
        <MetricCard icon={Zap}      label="Routes optimized"        value={s.routesOptimized.toLocaleString()} trend={12} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CarbonChart />
        </div>
        <div className="space-y-4">
          <WeatherWidget />
          <TrafficWidget />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === "authority" || user?.role === "admin") return <AuthorityDashboard />;
  return <CommuterDashboard />;
}
