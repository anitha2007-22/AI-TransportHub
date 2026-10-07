/**
 * LoginPage — authentication entry point with animated hero split layout
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, MapPin, Zap, Leaf, Navigation, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const DEMO_ACCOUNTS = [
  { label: "Commuter", email: "arjun@demo.com", color: "bg-primary-50 text-primary-700 border-primary-200" },
  { label: "Authority", email: "authority@demo.com", color: "bg-eco-50 text-eco-700 border-eco-200" },
  { label: "Admin", email: "admin@demo.com", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = email => {
    setEmail(email);
    setPassword("demo1234");
    setError("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left hero panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
            <Navigation size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">AI TransportHub</span>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Smarter journeys,<br />cleaner cities.
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              AI-powered mobility intelligence that helps you travel faster, cheaper, and greener — every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-sm">
            {[
              { icon: Zap, label: "Fastest route", desc: "Real-time traffic AI" },
              { icon: Leaf, label: "Eco score", desc: "Track carbon savings" },
              { icon: MapPin, label: "Live heatmap", desc: "City-wide congestion" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary-300" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{label}</p>
                  <p className="text-slate-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-500 text-sm">© 2025 AI TransportHub — Built for Hackathon Demo</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
              <Navigation size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-primary-700">AI TransportHub</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary-600 font-medium hover:underline">Create one</Link>
            </p>
          </div>

          {/* Quick demo buttons */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Quick demo login</p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map(a => (
                <button key={a.label} onClick={() => fillDemo(a.email)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${a.color} dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-field pr-11" />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center">
            Demo password for all accounts: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">demo1234</code>
          </p>
        </div>
      </div>
    </div>
  );
}
