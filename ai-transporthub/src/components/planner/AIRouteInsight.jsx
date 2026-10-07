/**
 * AIRouteInsight — Gemini-powered analysis panel for the selected route
 * Calls the Anthropic API (via claude-sonnet-4-6) to generate a smart summary.
 * Set VITE_ANTHROPIC_API_KEY in .env — or falls back to a mock response for demo.
 */
import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function AIRouteInsight({ from, to, time, selectedRoute }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [open, setOpen]       = useState(false);

  const fetchInsight = async () => {
    if (insight) { setOpen(o => !o); return; }
    setLoading(true); setError(""); setOpen(true);
    const prompt = `You are an AI mobility assistant for Chennai, India.
A user wants to travel from "${from}" to "${to}" at "${time}".
They selected the "${selectedRoute?.label}" route option.
In 2-3 sentences, give a smart, personalised travel tip: mention current traffic context, weather advisory, and one specific alternative they could consider. Be concise and helpful — no bullet points.`;

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("no_key");

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 200, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setInsight(data.content?.[0]?.text || "No insight returned.");
    } catch {
      // Graceful fallback for demo — simulates Gemini response
      await new Promise(r => setTimeout(r, 900));
      setInsight(`For your ${from} → ${to} trip at ${time}, the selected ${selectedRoute?.label || "route"} looks optimal. Traffic on Anna Salai is currently 68% congested — your metro leg bypasses this entirely. If rain intensifies after 5 PM, consider switching to the Safest (cab) route to avoid crowded platforms.`);
    }
    setLoading(false);
  };

  if (!from || !to) return null;

  return (
    <div className="bg-gradient-to-r from-primary-600/8 to-purple-600/8 dark:from-primary-900/25 dark:to-purple-900/25 border border-primary-100 dark:border-primary-800/50 rounded-2xl overflow-hidden">
      <button onClick={fetchInsight} className="flex items-center justify-between w-full px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={13} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">Ask AI about this trip</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Personalised insight · Powered by Claude</p>
          </div>
        </div>
        {loading ? <Loader2 size={16} className="text-primary-500 animate-spin" /> : open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="h-px bg-primary-100 dark:bg-primary-800/40 mb-3" />
          {loading ? (
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-4/5" />
            </div>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{insight}</p>
          )}
        </div>
      )}
    </div>
  );
}
