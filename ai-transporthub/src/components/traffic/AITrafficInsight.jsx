/**
 * AITrafficInsight — Claude-powered traffic analysis panel
 * Calls claude-sonnet-4-6 to generate a smart city-wide traffic briefing.
 * Falls back to a realistic simulated response for demo.
 */
import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { ZONE_CONGESTION, TRAFFIC_INCIDENTS } from "../../utils/mockData";

const buildPrompt = () => {
  const topZones = ZONE_CONGESTION.filter(z => z.level >= 70).map(z => `${z.zone} (${z.level}%)`).join(", ");
  const activeIncidents = TRAFFIC_INCIDENTS.filter(i => i.active).map(i => `${i.type} at ${i.location}`).join("; ");
  return `You are an AI traffic analyst for Chennai, India. Current time: ${new Date().toLocaleTimeString("en-IN")}.
Heavy congestion zones right now: ${topZones}.
Active incidents: ${activeIncidents}.
In 3 sentences, give a smart city-wide traffic briefing: highlight the worst bottleneck, predict when it will ease, and suggest one practical alternative for commuters. Be specific to Chennai geography. No bullet points.`;
};

const FALLBACK = "T. Nagar and Central are the worst bottlenecks right now at 91% and 88% congestion respectively — largely driven by the school run and the Anna Salai accident. AI models predict congestion will ease past 71% by 10:30 AM once school traffic disperses. Commuters heading into Central from the south should consider the Inner Ring Road via Guindy, which is running at just 35% and saves approximately 18 minutes at this hour.";

export default function AITrafficInsight() {
  const [text, setText]       = useState(FALLBACK);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("no_key");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 200, messages: [{ role: "user", content: buildPrompt() }] }),
      });
      const data = await res.json();
      setText(data.content?.[0]?.text || FALLBACK);
    } catch {
      await new Promise(r => setTimeout(r, 900));
      setText(FALLBACK);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-primary-600/8 to-purple-500/8 dark:from-primary-900/25 dark:to-purple-900/20 border border-primary-100 dark:border-primary-800/50 rounded-2xl p-4 flex items-start gap-4">
      <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow">
        <Sparkles size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">AI Traffic Briefing</p>
          <span className="text-xs text-slate-400">· Updated just now</span>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 0.85, 0.7].map((w, i) => (
              <div key={i} className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" style={{ width: `${w * 100}%` }} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
        )}
      </div>
      <button onClick={refresh} disabled={loading}
        className="text-slate-400 hover:text-primary-600 transition-colors flex-shrink-0 disabled:opacity-40 mt-0.5">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
      </button>
    </div>
  );
}
