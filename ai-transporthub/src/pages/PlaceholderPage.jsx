/**
 * PlaceholderPage — shown for modules not yet built (Phases 2–7)
 * Gives a preview of what's coming with a "Build this module" CTA
 */
import { useLocation } from "react-router-dom";
import { Construction, Sparkles } from "lucide-react";

const PAGE_META = {
  "/planner":       { title: "AI Journey Planner",     desc: "Enter source, destination & time — AI recommends fastest, cheapest, eco-friendly and safest routes.", phase: 2 },
  "/traffic":       { title: "Traffic Intelligence",    desc: "Live heatmap, congestion alerts, and AI-predicted traffic patterns for the next 4 hours.", phase: 3 },
  "/carbon":        { title: "Carbon Footprint Tracker",desc: "Track your CO₂ emissions, fuel savings, eco score, and monthly sustainability report.", phase: 4 },
  "/voice":         { title: "Multilingual Voice Assistant", desc: "Speak in English, Tamil, Tanglish or Hindi — AI understands and replies in your language.", phase: 5 },
  "/reports":       { title: "Citizen Issue Reporting", desc: "Report accidents, road damage, floods or broken signals with image upload and location pin.", phase: 5 },
  "/notifications": { title: "Smart Notifications",    desc: "Real-time alerts for traffic incidents, weather advisories, bus delays and road closures.", phase: 5 },
  "/analytics":     { title: "Authority Analytics",    desc: "Deep-dive dashboards for traffic density, peak hours, popular routes and carbon reduction stats.", phase: 6 },
  "/admin/users":   { title: "User Management",        desc: "Admin panel to manage all user accounts, roles and verification status.", phase: 7 },
  "/admin/transport": { title: "Transport Data Manager", desc: "Manage bus routes, metro schedules and real-time transport feed integrations.", phase: 7 },
  "/admin/settings":  { title: "System Settings",      desc: "Platform configuration, API key management, notification rules and audit logs.", phase: 7 },
};

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { title: "Coming Soon", desc: "This module is under development.", phase: "?" };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
        <Construction size={28} className="text-primary-600" />
      </div>
      <span className="text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full mb-3">
        Phase {meta.phase}
      </span>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{meta.title}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6">{meta.desc}</p>
      <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        <Sparkles size={16} />
        <span>Approve Phase 1 to start building this module.</span>
      </div>
    </div>
  );
}
