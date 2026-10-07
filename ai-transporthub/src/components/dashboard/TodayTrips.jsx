/**
 * TodayTrips — user's scheduled and completed trips for today
 */
import { MapPin, Clock, Leaf, CheckCircle2, Clock3, Calendar } from "lucide-react";
import { TRIPS_TODAY } from "../../utils/mockData";

const STATUS = {
  completed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20", label: "Completed" },
  upcoming:  { icon: Clock3,       color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", label: "Upcoming" },
  scheduled: { icon: Calendar,     color: "text-primary-500", bg: "bg-primary-50 dark:bg-primary-900/20", label: "Scheduled" },
};

export default function TodayTrips() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-primary-600" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Today's Trips</h3>
      </div>
      <div className="space-y-3">
        {TRIPS_TODAY.map(trip => {
          const s = STATUS[trip.status];
          const SIcon = s.icon;
          return (
            <div key={trip.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <SIcon size={16} className={s.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <span className="truncate">{trip.from}</span>
                  <MapPin size={10} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{trip.to}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-slate-400">{trip.time}</span>
                  <span className="text-xs text-slate-500">{trip.mode}</span>
                </div>
              </div>
              {trip.saved > 0 && (
                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg flex-shrink-0">
                  <Leaf size={11} className="text-green-600" />
                  <span className="text-xs text-green-700 dark:text-green-400 font-medium">-{trip.saved}kg</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
