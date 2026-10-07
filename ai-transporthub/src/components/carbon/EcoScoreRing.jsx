/**
 * EcoScoreRing — animated SVG ring showing the user's eco score (0–100)
 * with grade label, rank, and key stats below
 */
export default function EcoScoreRing({ score = 82, rank = "Top 12%", totalSaved = "19.4 kg", treesEquiv = "1.8 trees" }) {
  const radius = 64;
  const stroke = 10;
  const normalised = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const progress = ((100 - score) / 100) * circumference;

  const grade  = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : "D";
  const color  = score >= 80 ? "#16a34a" : score >= 60 ? "#eab308" : "#ef4444";
  const label  = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs work";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Your Eco Score</h3>
        <p className="text-xs text-slate-400 mt-0.5">This month · Chennai commuters</p>
      </div>

      {/* SVG ring */}
      <div className="relative">
        <svg width={radius * 2 + stroke} height={radius * 2 + stroke} className="-rotate-90">
          {/* Background track */}
          <circle cx={radius + stroke / 2} cy={radius + stroke / 2} r={normalised}
            fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
          {/* Progress arc */}
          <circle cx={radius + stroke / 2} cy={radius + stroke / 2} r={normalised}
            fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }} />
        </svg>
        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{score}</span>
          <span className="text-base font-bold mt-0.5" style={{ color }}>{grade}</span>
        </div>
      </div>

      <p className="text-sm font-semibold" style={{ color }}>{label}</p>

      {/* Stats row */}
      <div className="w-full grid grid-cols-3 gap-2 text-center">
        {[
          { label: "City rank",   value: rank },
          { label: "CO₂ saved",  value: totalSaved },
          { label: "≈ Trees",    value: treesEquiv },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl py-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
