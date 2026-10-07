import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 space-y-6 animate-slide-up">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
            <Navigation size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-primary-700 dark:text-primary-400">AI TransportHub</span>
        </div>

        {sent ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Check your inbox</h2>
              <p className="text-slate-500 text-sm mt-1">We've sent a reset link to <strong>{email}</strong></p>
            </div>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reset password</h2>
              <p className="text-slate-500 text-sm mt-1">Enter your email and we'll send a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="input-field pl-10" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
            <Link to="/login" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
