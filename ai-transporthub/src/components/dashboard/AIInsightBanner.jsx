/**
 * AIInsightBanner — Gemini AI-powered daily travel insight (simulated for demo)
 */
import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

const INSIGHTS = [
  "Based on your travel pattern, taking Metro at 7:45 AM saves you 18 minutes and reduces CO₂ by 1.2 kg compared to your usual cab route.",
  "Heavy rainfall is predicted tonight. I recommend completing your Office→Home trip before 5:30 PM to avoid a 40-minute delay on Rajiv Gandhi Salai.",
  "Your eco score is in the top 12% of Chennai commuters this week! Switching to Bus on Tuesdays could push you into top 5%.",
  "Traffic on GST Road peaks between 8:30–9:15 AM. Leaving 20 minutes earlier or using the Inner Ring Road alternate saves ~25 minutes today.",
];

export default function AIInsightBanner() {
  const [insight, setInsight] = useState(INSIGHTS[0]);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      const next = (idx + 1) % INSIGHTS.length;
      setIdx(next);
      setInsight(INSIGHTS[next]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="bg-gradient-to-r from-primary-600/10 to-green-600/10 dark:from-primary-900/30 dark:to-green-900/30 border border-primary-100 dark:border-primary-800 rounded-2xl p-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <Sparkles size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider">AI Insight</p>
          <span className="text-xs text-slate-400">· Powered by Gemini</span>
        </div>
        {loading ? (
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-4/5" />
          </div>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{insight}</p>
        )}
      </div>
      <button onClick={refresh} disabled={loading} className="text-slate-400 hover:text-primary-600 transition-colors flex-shrink-0 mt-0.5 disabled:opacity-40">
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
}
