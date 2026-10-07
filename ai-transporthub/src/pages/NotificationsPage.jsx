/**
 * NotificationsPage — Phase 5c: Smart Notifications
 * Filterable feed with category tabs, read/unread states, bulk actions
 */
import { useState } from "react";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import { ALL_NOTIFICATIONS } from "../utils/mockData";
import toast from "react-hot-toast";

const CATS = [
  { id: "all",     label: "All",         icon: "🔔" },
  { id: "alert",   label: "Alerts",      icon: "🚨" },
  { id: "weather", label: "Weather",     icon: "🌧️" },
  { id: "transit", label: "Transit",     icon: "🚇" },
  { id: "eco",     label: "Eco",         icon: "🌿" },
  { id: "ai",      label: "AI Tips",     icon: "✨" },
];

const PRIORITY_BORDER = {
  critical: "border-l-4 border-l-red-500",
  high:     "border-l-4 border-l-orange-400",
  medium:   "border-l-4 border-l-amber-400",
  low:      "",
};

export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState(ALL_NOTIFICATIONS);
  const [cat, setCat]         = useState("all");

  const filtered  = cat === "all" ? notifs : notifs.filter(n => n.cat === cat);
  const unreadCnt = notifs.filter(n => !n.read).length;

  const markRead = id => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss  = id => { setNotifs(ns => ns.filter(n => n.id !== id)); toast.success("Notification dismissed"); };
  const markAll  = () => { setNotifs(ns => ns.map(n => ({ ...n, read: true }))); toast.success("All marked as read"); };
  const clearAll = () => { setNotifs([]); toast.success("All notifications cleared"); };

  return (
    <div className="space-y-5 animate-slide-up max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell size={21} className="text-primary-600" /> Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {unreadCnt > 0 ? <><strong className="text-primary-600">{unreadCnt} unread</strong> · </> : "All caught up · "}
            Traffic, weather and AI alerts in one place.
          </p>
        </div>
        {notifs.length > 0 && (
          <div className="flex gap-2">
            {unreadCnt > 0 && (
              <button onClick={markAll}
                className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3">
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button onClick={clearAll}
              className="flex items-center gap-1.5 text-xs py-2 px-3 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium">
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* Category tab pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATS.map(c => {
          const count = c.id === "all"
            ? notifs.filter(n => !n.read).length
            : notifs.filter(n => n.cat === c.id && !n.read).length;
          return (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 border ${
                cat === c.id
                  ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300"
              }`}>
              <span>{c.icon}</span>
              {c.label}
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cat === c.id ? "bg-white/25 text-white" : "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-4xl">🎉</div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">All clear!</p>
          <p className="text-sm text-slate-400">No notifications in this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <div key={n.id}
              onClick={() => markRead(n.id)}
              className={`group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer transition-all hover:shadow-md ${PRIORITY_BORDER[n.priority]} ${!n.read ? "bg-primary-50/40 dark:bg-primary-900/10" : ""}`}>
              <div className="flex items-start gap-3 px-4 py-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${!n.read ? "bg-primary-50 dark:bg-primary-900/30" : "bg-slate-50 dark:bg-slate-800"}`}>
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${!n.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5">{n.time}</p>
                </div>

                {/* Dismiss button — appears on hover */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-400 flex-shrink-0 mt-0.5">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Tip banner */}
      {filtered.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-100 dark:border-primary-800 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">✨</span>
          <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
            <strong>AI is monitoring your routes.</strong> You'll be notified 30 minutes before predicted congestion spikes on your saved routes, giving you time to choose an alternative.
          </p>
        </div>
      )}
    </div>
  );
}
