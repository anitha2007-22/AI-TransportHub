/**
 * SampleQueries — tap-to-try example voice commands
 */
import { SAMPLE_VOICE_QUERIES } from "../../utils/mockData";

export default function SampleQueries({ onSelect }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Try saying…</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SAMPLE_VOICE_QUERIES.map((q, i) => (
          <button key={i} onClick={() => onSelect(q.text)}
            className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all text-left group">
            <span className="text-xl">{q.icon}</span>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{q.lang.split("-")[0]}</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                "{q.text}"
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
