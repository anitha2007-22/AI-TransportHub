/**
 * LanguagePicker — select assistant language with animated highlight
 */
import { VOICE_LANGUAGES } from "../../utils/mockData";

export default function LanguagePicker({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {VOICE_LANGUAGES.map(lang => (
        <button key={lang.id} onClick={() => onChange(lang)}
          className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl border-2 transition-all duration-200 ${
            selected.id === lang.id
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md scale-[1.02]"
              : "border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 bg-white dark:bg-slate-900"
          }`}>
          <span className="text-2xl">{lang.flag}</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{lang.label}</p>
          <p className="text-xs text-slate-400">{lang.native}</p>
        </button>
      ))}
    </div>
  );
}
