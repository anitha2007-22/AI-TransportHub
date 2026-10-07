/**
 * Topbar — header with search, theme toggle, and notification bell
 */
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Bell, Moon, Sun, Menu, Search } from "lucide-react";
import { NOTIFICATIONS } from "../../utils/mockData";

export default function Topbar({ onMenuOpen }) {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const typeIcon = { alert: "🚨", weather: "🌧️", info: "ℹ️", eco: "🌿" };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-20">
      <button onClick={onMenuOpen} className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1">
        <Menu size={22} />
      </button>

      <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input placeholder="Search routes, places…" className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none" />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button onClick={toggle} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifs(s => !s)} className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Bell size={18} />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</p>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{unread} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!n.read ? "bg-primary-50/50 dark:bg-primary-900/10" : ""}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon[n.type]}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">{user?.avatar}</div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{user?.name?.split(" ")[0]}</p>
            <p className="text-xs text-slate-500 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
