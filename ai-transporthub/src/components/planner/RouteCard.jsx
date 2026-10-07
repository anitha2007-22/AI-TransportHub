/**
 * RouteCard — single route option card with metrics, steps, and AI score
 */
import { Clock, IndianRupee, Leaf, Users, CheckCircle, XCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";

const TAG_STYLES = {
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  amber:   "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  green:   "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  purple:  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

const SCORE_COLOR = s => s >= 88 ? "text-green-600" : s >= 75 ? "text-amber-600" : "text-slate-500";
const SCORE_BG    = s => s >= 88 ? "bg-green-50 dark:bg-green-900/20" : s >= 75 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-slate-50 dark:bg-slate-800";

export default function RouteCard({ route, selected, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const { label, tag, tagColor, duration, distance, cost, carbon, crowd, crowdLevel, steps, pros, cons, aiScore } = route;

  return (
    <div
      onClick={() => onSelect(route.id)}
      className={`rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-md"
          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-200 hover:shadow-sm"
      }`}
    >
      {/* Header row */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{label}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TAG_STYLES[tagColor]}`}>{tag}</span>
          </div>
          {/* AI Score badge */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${SCORE_BG(aiScore)}`}>
            <Sparkles size={11} className={SCORE_COLOR(aiScore)} />
            <span className={`text-xs font-bold ${SCORE_COLOR(aiScore)}`}>{aiScore}</span>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { icon: Clock,        val: duration,  label: "Time" },
            { icon: IndianRupee,  val: cost,      label: "Cost" },
            { icon: Leaf,         val: carbon,    label: "Carbon" },
            { icon: Users,        val: crowd,     label: "Crowd" },
          ].map(({ icon: Icon, val, label: lbl }) => (
            <div key={lbl} className="text-center">
              <Icon size={13} className="text-slate-400 mx-auto mb-0.5" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{val}</p>
              <p className="text-[10px] text-slate-400">{lbl}</p>
            </div>
          ))}
        </div>

        {/* Crowd bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Crowd level</span><span>{crowdLevel}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${crowdLevel > 70 ? "bg-red-400" : crowdLevel > 45 ? "bg-amber-400" : "bg-green-400"}`}
              style={{ width: `${crowdLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps & pros/cons — expandable */}
      <div className="border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}
          className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors"
        >
          <span>Step-by-step directions</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-4 animate-fade-in">
            {/* Steps */}
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg w-7 flex-shrink-0 text-center">{step.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 dark:text-slate-300">{step.desc}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{step.duration}</span>
                </div>
              ))}
            </div>

            {/* Pros / Cons */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                {pros.map(p => (
                  <div key={p} className="flex items-center gap-1.5">
                    <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">{p}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {cons.map(c => (
                  <div key={c} className="flex items-center gap-1.5">
                    <XCircle size={11} className="text-red-400 flex-shrink-0" />
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
