/**
 * JourneyForm — the main trip input form: source, destination, date, time, preferences
 */
import { useState } from "react";
import { ArrowUpDown, Clock, Calendar, Sliders } from "lucide-react";
import LocationInput from "./LocationInput";

const PREFERENCES = ["Avoid tolls", "Wheelchair accessible", "Avoid highways", "Prefer covered routes"];

export default function JourneyForm({ onSearch }) {
  const today = new Date().toISOString().split("T")[0];
  const now   = new Date().toTimeString().slice(0, 5);

  const [from, setFrom]         = useState("");
  const [to, setTo]             = useState("");
  const [date, setDate]         = useState(today);
  const [time, setTime]         = useState(now);
  const [prefs, setPrefs]       = useState([]);
  const [showPrefs, setShowPrefs] = useState(false);

  const swap = () => { setFrom(to); setTo(from); };

  const togglePref = p => setPrefs(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!from || !to) return;
    onSearch({ from, to, date, time, prefs });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-900 dark:text-white text-base">Plan your journey</h2>

      {/* From / To with swap button */}
      <div className="relative space-y-3">
        <LocationInput
          label="From"
          value={from}
          onChange={setFrom}
          placeholder="Starting point…"
          iconColor="text-green-500"
        />
        {/* Swap button */}
        <button type="button" onClick={swap}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 flex items-center justify-center text-slate-500 transition-all z-10">
          <ArrowUpDown size={14} />
        </button>
        <LocationInput
          label="To"
          value={to}
          onChange={setTo}
          placeholder="Destination…"
          iconColor="text-red-500"
        />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
              className="input-field pl-8 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Depart at</label>
          <div className="relative">
            <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="input-field pl-8 text-sm" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <button type="button" onClick={() => setShowPrefs(s => !s)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors">
          <Sliders size={13} />
          Preferences {prefs.length > 0 && <span className="bg-primary-100 text-primary-700 rounded-full px-1.5">{prefs.length}</span>}
        </button>
        {showPrefs && (
          <div className="mt-2 flex flex-wrap gap-2 animate-fade-in">
            {PREFERENCES.map(p => (
              <button key={p} type="button" onClick={() => togglePref(p)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                  prefs.includes(p)
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300"
                }`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={!from || !to}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
        Find best routes
      </button>
    </form>
  );
}
