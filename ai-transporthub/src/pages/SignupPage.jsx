/**
 * SignupPage — new user registration with role selection
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Navigation, AlertCircle, User, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "commuter" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      toast.success("Account created! Welcome aboard.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 dark:from-slate-950 dark:to-slate-900 px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 space-y-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
            <Navigation size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-primary-700 dark:text-primary-400">AI TransportHub</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h2>
          <p className="text-slate-500 text-sm mt-1">
            Already have one?{" "}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
            <input type="text" required value={form.name} onChange={set("name")} placeholder="Arjun Kumar" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} required value={form.password}
                onChange={set("password")} placeholder="Min 6 characters" className="input-field pr-11" />
              <button type="button" onClick={() => setShowPwd(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "commuter", label: "Commuter", icon: User, desc: "Plan trips, track savings" },
                { value: "authority", label: "Authority", icon: Building2, desc: "City dashboard & analytics" },
              ].map(({ value, label, icon: Icon, desc }) => (
                <label key={value} className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${form.role === value ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}>
                  <input type="radio" name="role" value={value} checked={form.role === value} onChange={set("role")} className="sr-only" />
                  <Icon size={20} className={form.role === value ? "text-primary-600" : "text-slate-400"} />
                  <p className="font-medium text-sm text-slate-900 dark:text-white mt-1">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
