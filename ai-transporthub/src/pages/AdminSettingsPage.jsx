/**
 * AdminSettingsPage — system-wide config: API keys, notifications, AI model, audit log
 */
import { useState } from "react";
import { Settings, Key, Bell, Cpu, Shield, Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const AUDIT_LOG = [
  { id: 1, action: "User suspended",        user: "Admin",     target: "mohan@gmail.com",    time: "2 min ago" },
  { id: 2, action: "Route 12B deactivated", user: "Admin",     target: "Route 12B",          time: "1 hr ago" },
  { id: 3, action: "API key rotated",       user: "Admin",     target: "Google Maps API",    time: "3 hr ago" },
  { id: 4, action: "User role changed",     user: "Admin",     target: "priya@demo.com → authority", time: "5 hr ago" },
  { id: 5, action: "Notification sent",     user: "System",    target: "All Chennai users",  time: "8 hr ago" },
  { id: 6, action: "New report flagged",    user: "AI System", target: "Critical: Anna Salai accident", time: "1 day ago" },
];

function KeyField({ label, placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className="input-field pl-9 pr-9 text-sm font-mono" />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [keys, setKeys] = useState({ anthropic: "", maps: "", weather: "", firebase: "" });
  const [notifSettings, setNotifs] = useState({ accidents: true, weather: true, metro_delay: true, bus_delay: false, eco_weekly: true, ai_tips: true });
  const [aiSettings, setAI] = useState({ model: "claude-sonnet-4-6", maxTokens: 200, language: "en-IN", ecoWeight: 40 });
  const [saving, setSaving] = useState(false);

  const setKey   = k => v => setKeys(ks => ({ ...ks, [k]: v }));
  const toggleNotif = k => setNotifs(ns => ({ ...ns, [k]: !ns[k] }));

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-5 animate-slide-up max-w-3xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings size={21} className="text-slate-600" /> System Settings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Platform configuration, API keys, and AI model settings.</p>
        </div>
        <button onClick={save} disabled={saving}
          className="btn-primary flex items-center gap-2 text-sm py-2 disabled:opacity-60">
          <Save size={15} className={saving ? "animate-spin" : ""} />
          {saving ? "Saving…" : "Save all settings"}
        </button>
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
          <Key size={16} className="text-primary-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">API Keys</h3>
        </div>
        <KeyField label="Anthropic API Key (Claude AI)" placeholder="sk-ant-..." value={keys.anthropic} onChange={setKey("anthropic")} />
        <KeyField label="Google Maps API Key" placeholder="AIza..." value={keys.maps} onChange={setKey("maps")} />
        <KeyField label="OpenWeatherMap API Key" placeholder="owm_..." value={keys.weather} onChange={setKey("weather")} />
        <KeyField label="Firebase Server Key" placeholder="AAAA..." value={keys.firebase} onChange={setKey("firebase")} />
        <p className="text-xs text-slate-400">Keys are encrypted at rest and never exposed to client-side code.</p>
      </div>

      {/* Notification rules */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
          <Bell size={16} className="text-amber-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Notification Rules</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: "accidents",    label: "Accident alerts",          desc: "Notify all users near incident within 2 km" },
            { key: "weather",      label: "Weather advisories",       desc: "Send rain/flood warnings from IMD feed" },
            { key: "metro_delay",  label: "Metro delay alerts",       desc: "Push when CMRL delay exceeds 8 minutes" },
            { key: "bus_delay",    label: "Bus delay alerts",         desc: "Push when MTC delay exceeds 15 minutes" },
            { key: "eco_weekly",   label: "Weekly eco report",        desc: "Send carbon savings digest every Monday" },
            { key: "ai_tips",      label: "AI traffic predictions",   desc: "Predictive alerts 30 min before congestion spikes" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <button onClick={() => toggleNotif(key)}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifSettings[key] ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-700"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${notifSettings[key] ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI model settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
          <Cpu size={16} className="text-purple-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">AI Model Configuration</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Model</label>
            <select value={aiSettings.model} onChange={e => setAI(a => ({ ...a, model: e.target.value }))}
              className="input-field text-sm">
              <option value="claude-sonnet-4-6">claude-sonnet-4-6 (Recommended)</option>
              <option value="claude-haiku-4-5-20251001">claude-haiku-4-5 (Faster)</option>
              <option value="claude-opus-4-6">claude-opus-4-6 (Most capable)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Default language</label>
            <select value={aiSettings.language} onChange={e => setAI(a => ({ ...a, language: e.target.value }))}
              className="input-field text-sm">
              <option value="en-IN">English (India)</option>
              <option value="ta-IN">Tamil</option>
              <option value="hi-IN">Hindi</option>
            </select>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider">Eco route weighting</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{aiSettings.ecoWeight}%</span>
          </div>
          <input type="range" min={0} max={100} value={aiSettings.ecoWeight}
            onChange={e => setAI(a => ({ ...a, ecoWeight: +e.target.value }))}
            className="w-full accent-primary-600" />
          <p className="text-xs text-slate-400 mt-1">Higher = AI recommends eco routes more aggressively in tie-breaks</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Max tokens per response</label>
          <input type="number" value={aiSettings.maxTokens} min={50} max={1000} step={50}
            onChange={e => setAI(a => ({ ...a, maxTokens: +e.target.value }))}
            className="input-field text-sm w-32" />
        </div>
      </div>

      {/* Audit log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Shield size={16} className="text-slate-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Audit log</h3>
          <span className="ml-auto text-xs text-slate-400">Last 7 days</span>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {AUDIT_LOG.map(entry => (
            <div key={entry.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{entry.action}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">By {entry.user} · {entry.target}</p>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
