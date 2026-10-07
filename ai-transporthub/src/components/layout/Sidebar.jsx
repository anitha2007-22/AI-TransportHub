/**
 * Sidebar — role-aware navigation panel with collapsible support
 */
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Map, Activity, Leaf, Mic2, Flag,
  Bell, Users, Settings, LogOut, Navigation, ChevronLeft,
  BarChart3, Building2, X
} from "lucide-react";

const COMMUTER_NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/planner", icon: Map, label: "Journey Planner" },
  { to: "/traffic", icon: Activity, label: "Traffic" },
  { to: "/carbon", icon: Leaf, label: "Carbon Footprint" },
  { to: "/voice", icon: Mic2, label: "Voice Assistant" },
  { to: "/reports", icon: Flag, label: "Report Issue" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
];

const AUTHORITY_NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "City Dashboard" },
  { to: "/traffic", icon: Activity, label: "Traffic Monitor" },
  { to: "/reports", icon: Flag, label: "Citizen Reports" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
];

const ADMIN_NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Manage Users" },
  { to: "/admin/transport", icon: Building2, label: "Transport Data" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "System Settings" },
];

const NAV_MAP = { commuter: COMMUTER_NAV, authority: AUTHORITY_NAV, admin: ADMIN_NAV };

export default function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navItems = NAV_MAP[user?.role] || COMMUTER_NAV;
  const roleColor = { commuter: "bg-primary-600", authority: "bg-green-600", admin: "bg-purple-600" }[user?.role] || "bg-slate-600";
  const roleLabel = { commuter: "Commuter", authority: "Transport Authority", admin: "Administrator" }[user?.role] || "User";

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onMobileClose} />}
      <aside className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className={`w-9 h-9 rounded-xl ${roleColor} flex items-center justify-center flex-shrink-0`}>
            <Navigation size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-slate-900 dark:text-white truncate">AI TransportHub</p>
              <p className="text-xs text-slate-500 truncate">{roleLabel}</p>
            </div>
          )}
          <button onClick={onMobileClose} className="lg:hidden text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === "/dashboard"}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}`}
              title={collapsed ? label : undefined}>
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 dark:border-slate-800 p-3 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div className={`w-8 h-8 rounded-full ${roleColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{user?.avatar}</div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}
          <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all" title={collapsed ? "Sign out" : undefined}>
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
          <button onClick={onCollapse} className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <ChevronLeft size={18} className={`flex-shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
