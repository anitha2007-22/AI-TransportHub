/**
 * VoiceOrb — animated microphone button
 * States: idle · listening · processing · speaking
 */
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";

const STATE_CONFIG = {
  idle:       { icon: Mic,     bg: "bg-primary-600 hover:bg-primary-700",  ring: "", label: "Tap to speak" },
  listening:  { icon: Mic,     bg: "bg-red-500",   ring: "ring-4 ring-red-400/40 animate-pulse", label: "Listening…" },
  processing: { icon: Loader2, bg: "bg-amber-500",  ring: "ring-4 ring-amber-400/30",              label: "Processing…" },
  speaking:   { icon: Volume2, bg: "bg-green-600",  ring: "ring-4 ring-green-400/40 animate-pulse",label: "Speaking…" },
  error:      { icon: MicOff,  bg: "bg-slate-500",  ring: "",               label: "Try again" },
};

export default function VoiceOrb({ state, onClick }) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.idle;
  const Icon = cfg.icon;
  const isSpinning = state === "processing";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Outer glow rings */}
      <div className="relative">
        {state === "listening" && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping scale-150" />
            <div className="absolute inset-0 rounded-full bg-red-400/10 animate-ping scale-[2.2] animation-delay-300" />
          </>
        )}
        {state === "speaking" && (
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping scale-150" />
        )}

        <button
          onClick={onClick}
          className={`relative w-24 h-24 rounded-full ${cfg.bg} ${cfg.ring} flex items-center justify-center shadow-xl transition-all duration-300 active:scale-95`}
        >
          <Icon size={36} className={`text-white ${isSpinning ? "animate-spin" : ""}`} />
        </button>
      </div>

      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 tracking-wide">{cfg.label}</p>
    </div>
  );
}
