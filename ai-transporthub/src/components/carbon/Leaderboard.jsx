/**
 * Leaderboard — city eco score ranking, current user highlighted
 */
import { Trophy } from "lucide-react";
import { LEADERBOARD } from "../../utils/mockData";

const RANK_STYLE = {
  1: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", icon: "🥇" },
  2: { bg: "bg-slate-100 dark:bg-slate-700",       text: "text-slate-600 dark:text-slate-300",   icon: "🥈" },
  3: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", icon: "🥉" },
};

export default function Leaderboard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={17} className="text-amber-500" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Chennai eco leaderboard</h3>
        <span className="ml-auto text-xs text-slate-400">This month</span>
      </div>

      <div className="space-y-2">
        {LEADERBOARD.map(entry => {
          const rankStyle = RANK_STYLE[entry.rank] || { bg: "bg-slate-50 dark:bg-slate-800", text: "text-slate-500", icon: `#${entry.rank}` };
          return (
            <div key={entry.rank}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                entry.isUser
                  ? "bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}>
              {/* Rank */}
              <div className={`w-8 h-8 rounded-full ${rankStyle.bg} flex items-center justify-center text-sm flex-shrink-0`}>
                {typeof rankStyle.icon === "string" && rankStyle.icon.startsWith("#")
                  ? <span className={`text-xs font-bold ${rankStyle.text}`}>{rankStyle.icon}</span>
                  : <span>{rankStyle.icon}</span>}
              </div>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${entry.isUser ? "bg-primary-600" : "bg-slate-400 dark:bg-slate-600"}`}>
                {entry.avatar}
              </div>

              {/* Name + city */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${entry.isUser ? "text-primary-700 dark:text-primary-400" : "text-slate-800 dark:text-slate-200"}`}>
                  {entry.name} {entry.isUser && <span className="text-[10px] font-normal ml-1">(you)</span>}
                </p>
                <p className="text-xs text-slate-400">{entry.city}</p>
              </div>

              {/* Score + saved */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{entry.score}</p>
                <p className="text-[10px] text-green-600">−{entry.saved}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center mt-4">
        You're ranked <strong className="text-primary-600">#4 out of 1,842</strong> commuters in Chennai this month 🎉
      </p>
    </div>
  );
}
