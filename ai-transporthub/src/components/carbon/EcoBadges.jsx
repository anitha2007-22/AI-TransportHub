/**
 * EcoBadges — achievement badge grid, unlocked and locked states
 */
import { Lock } from "lucide-react";
import { ECO_BADGES } from "../../utils/mockData";

export default function EcoBadges() {
  const unlocked = ECO_BADGES.filter(b => b.unlocked);
  const locked   = ECO_BADGES.filter(b => !b.unlocked);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">🏅 Eco Achievements</h3>
        <span className="text-xs text-slate-400">{unlocked.length}/{ECO_BADGES.length} unlocked</span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${(unlocked.length / ECO_BADGES.length) * 100}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-1">{unlocked.length} of {ECO_BADGES.length} badges earned</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ECO_BADGES.map(badge => (
          <div key={badge.id}
            className={`rounded-xl border p-3 flex items-start gap-3 transition-all ${
              badge.unlocked
                ? "border-green-100 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10"
                : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-60"
            }`}
          >
            <div className={`text-2xl flex-shrink-0 ${!badge.unlocked ? "grayscale opacity-40" : ""}`}>
              {badge.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-semibold truncate ${badge.unlocked ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>
                  {badge.label}
                </p>
                {!badge.unlocked && <Lock size={10} className="text-slate-400 flex-shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
