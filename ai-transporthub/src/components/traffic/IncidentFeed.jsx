/**
 * IncidentFeed — real-time traffic incident list with severity badges
 */
import { useState } from "react";
import { AlertTriangle, Construction, Droplets, Zap, Megaphone, Car, ChevronDown, ChevronUp, Navigation } from "lucide-react";
import { TRAFFIC_INCIDENTS } from "../../utils/mockData";

const TYPE_META = {
  "Accident":        { icon: Car,           bg: "bg-red-100 dark:bg-red-900/30",    text: "text-red-600 dark:text-red-400" },
  "Road Work":       { icon: Construction,   bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
  "Waterlogging":    { icon: Droplets,       bg: "bg-blue-100 dark:bg-blue-900/30",   text: "text-blue-600 dark:text-blue-400" },
  "Signal Down":     { icon: Zap,            bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
  "Event Diversion": { icon: Megaphone,      bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
  "Vehicle Breakdown":{ icon: AlertTriangle, bg: "bg-slate-100 dark:bg-slate-800",   text: "text-slate-600 dark:text-slate-400" },
};

const SEV_BADGE = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  high:     "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  medium:   "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  low:      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function IncidentRow({ incident }) {
  const [open, setOpen] = useState(false);
  const meta = TYPE_META[incident.type] || TYPE_META["Vehicle Breakdown"];
  const Icon = meta.icon;

  return (
    <div className={`rounded-xl border transition-all duration-200 ${incident.active ? "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900" : "border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 opacity-70"}`}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={16} className={meta.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{incident.location}</p>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${SEV_BADGE[incident.severity]}`}>
              {incident.severity}
            </span>
            {!incident.active && (
              <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Resolved</span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{incident.type} · {incident.reported}</p>
        </div>
        {open ? <ChevronUp size={15} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={15} className="text-slate-400 flex-shrink-0" />}
      </div>

      {open && (
        <div className="px-4 pb-3 pt-0 animate-fade-in border-t border-slate-50 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{incident.desc}</p>
          <button className="mt-2 flex items-center gap-1.5 text-xs text-primary-600 font-medium hover:underline">
            <Navigation size={11} /> Plan route around this
          </button>
        </div>
      )}
    </div>
  );
}

export default function IncidentFeed({ filter }) {
  const filtered = TRAFFIC_INCIDENTS.filter(i =>
    filter === "all" ? true : filter === "active" ? i.active : !i.active
  );

  return (
    <div className="space-y-2">
      {filtered.length === 0
        ? <p className="text-sm text-slate-400 text-center py-6">No incidents to show.</p>
        : filtered.map(i => <IncidentRow key={i.id} incident={i} />)
      }
    </div>
  );
}
