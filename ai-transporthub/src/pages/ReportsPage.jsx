/**
 * ReportsPage — Phase 5b: Citizen Issue Reporting
 * Submit new reports with type, location, priority, description, image upload
 * View existing community reports with status tracking
 */
import { useState, useRef } from "react";
import { MapPin, Upload, Send, CheckCircle, ChevronDown, ChevronUp, ThumbsUp, Clock, AlertCircle } from "lucide-react";
import { REPORT_TYPES, EXISTING_REPORTS } from "../utils/mockData";
import toast from "react-hot-toast";

const PRIORITIES = [
  { id: "critical", label: "Critical", color: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700" },
  { id: "high",     label: "High",     color: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700" },
  { id: "medium",   label: "Medium",   color: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700" },
  { id: "low",      label: "Low",      color: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600" },
];

const STATUS_STYLE = {
  pending:       { label: "Pending",       color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  acknowledged:  { label: "Acknowledged",  color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  investigating: { label: "Investigating", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  resolved:      { label: "Resolved",      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

function ReportCard({ report }) {
  const [open, setOpen] = useState(false);
  const [votes, setVotes] = useState(report.votes);
  const [voted, setVoted] = useState(false);
  const type = REPORT_TYPES.find(t => t.id === report.type);
  const status = STATUS_STYLE[report.status];

  const upvote = (e) => {
    e.stopPropagation();
    if (voted) return;
    setVotes(v => v + 1);
    setVoted(true);
    toast.success("Thanks for confirming this report!");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setOpen(o => !o)}>
        <span className="text-2xl flex-shrink-0">{type?.icon || "📋"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{report.location}</p>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-slate-500">{type?.label}</span>
            <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{report.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={upvote}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${voted ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-400" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary-300 hover:text-primary-600"}`}>
            <ThumbsUp size={11} />{votes}
          </button>
          {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 border-t border-slate-50 dark:border-slate-800 pt-3 animate-fade-in space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-slate-400" />
            <p className="text-xs text-slate-600 dark:text-slate-400">{report.location}</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reported {report.time} · {votes} community confirmations
          </p>
          {report.status === "resolved" && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
              <CheckCircle size={13} className="text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-400">This issue has been resolved by the transport authority.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState("submit");
  const [form, setForm] = useState({ type: "", location: "", priority: "medium", description: "", image: null });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const set = key => val => setForm(f => ({ ...f, [key]: val }));
  const setE = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleImage = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.type || !form.location) { toast.error("Please fill in type and location."); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Report submitted! Authorities have been notified.");
  };

  const reset = () => { setForm({ type: "", location: "", priority: "medium", description: "", image: null }); setPreview(null); setSubmitted(false); };

  return (
    <div className="space-y-5 animate-slide-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          🚨 Citizen Issue Reporting
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Report road issues, accidents, or hazards to help your city.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {[{ id: "submit", label: "Report issue" }, { id: "community", label: "Community reports" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "submit" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-10 text-center shadow-sm space-y-4 animate-slide-up">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Report submitted!</h3>
                  <p className="text-sm text-slate-500 mt-1">Transport authorities have been notified. You'll receive a status update within 30 minutes.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <p><strong>Type:</strong> {REPORT_TYPES.find(t => t.id === form.type)?.label}</p>
                  <p><strong>Location:</strong> {form.location}</p>
                  <p><strong>Priority:</strong> {form.priority}</p>
                </div>
                <button onClick={reset} className="btn-primary">Submit another report</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-5">
                {/* Issue type grid */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Issue type <span className="text-red-500">*</span></p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {REPORT_TYPES.map(t => (
                      <button type="button" key={t.id} onClick={() => set("type")(t.id)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all ${form.type === t.id ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300" : "border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-200"}`}>
                        <span className="text-xl">{t.icon}</span>
                        <span className="text-center leading-tight">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none" />
                    <input type="text" value={form.location} onChange={setE("location")}
                      placeholder="e.g. Anna Salai, near Gemini Flyover"
                      className="input-field pl-9 text-sm" />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Priority</p>
                  <div className="flex gap-2 flex-wrap">
                    {PRIORITIES.map(p => (
                      <button type="button" key={p.id} onClick={() => set("priority")(p.id)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border-2 transition-all ${form.priority === p.id ? p.color : "border-slate-200 dark:border-slate-700 text-slate-500 bg-white dark:bg-slate-900"}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={form.description} onChange={setE("description")} rows={3}
                    placeholder="Describe the issue in detail…"
                    className="input-field text-sm resize-none" />
                </div>

                {/* Image upload */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Photo (optional)</p>
                  {preview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                      <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
                      <button type="button" onClick={() => { setPreview(null); setForm(f => ({ ...f, image: null })); }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-2 py-1 text-xs font-medium">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-8 flex flex-col items-center gap-2 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all">
                      <Upload size={22} className="text-slate-400" />
                      <p className="text-sm text-slate-500">Click to upload a photo</p>
                      <p className="text-xs text-slate-400">PNG, JPG up to 10 MB</p>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                    </div>
                  )}
                </div>

                <button type="submit" disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</>
                    : <><Send size={15} />Submit report</>}
                </button>
              </form>
            )}
          </div>

          {/* Right: tips panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <AlertCircle size={16} className="text-primary-600" /> Reporting tips
              </h3>
              {[
                { icon: "📍", tip: "Be as specific as possible with the location — include landmarks." },
                { icon: "📷", tip: "A photo helps authorities prioritise and respond faster." },
                { icon: "⚡", tip: "Critical issues (accidents, flooding) are escalated immediately." },
                { icon: "🔔", tip: "You'll receive status updates as authorities act on your report." },
              ].map(({ icon, tip }) => (
                <div key={tip} className="flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0">{icon}</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800 p-4 space-y-2">
              <p className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider">AI auto-routing</p>
              <p className="text-xs text-primary-600 dark:text-primary-300/80 leading-relaxed">
                After your report is submitted, the AI Journey Planner automatically suggests alternate routes to other commuters passing through the affected area.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "community" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{EXISTING_REPORTS.length} reports in your area</p>
            <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-full font-medium">
              {EXISTING_REPORTS.filter(r => r.status !== "resolved").length} active
            </span>
          </div>
          {EXISTING_REPORTS.map(r => <ReportCard key={r.id} report={r} />)}
        </div>
      )}
    </div>
  );
}
