/**
 * AdminUsersPage — user management panel for admin role
 * Lists users, roles, status; supports search, filter, and role change
 */
import { useState } from "react";
import { Users, Search, Shield, UserCheck, UserX, MoreVertical, Download } from "lucide-react";
import toast from "react-hot-toast";

const MOCK_USERS = [
  { id: 1, name: "Arjun Kumar",    email: "arjun@demo.com",      role: "commuter",  status: "active",   joined: "2025-01-12", trips: 142, ecoScore: 82 },
  { id: 2, name: "Priya Nair",     email: "authority@demo.com",   role: "authority", status: "active",   joined: "2025-02-03", trips: 0,   ecoScore: null },
  { id: 3, name: "Rajan M.",       email: "rajan@gmail.com",      role: "commuter",  status: "active",   joined: "2025-03-18", trips: 98,  ecoScore: 94 },
  { id: 4, name: "Deepa S.",       email: "deepa@gmail.com",      role: "commuter",  status: "active",   joined: "2025-01-30", trips: 201, ecoScore: 97 },
  { id: 5, name: "Surya T.",       email: "surya@company.com",    role: "commuter",  status: "inactive", joined: "2025-04-05", trips: 34,  ecoScore: 79 },
  { id: 6, name: "Kavitha R.",     email: "kavitha@demo.com",     role: "commuter",  status: "active",   joined: "2025-02-22", trips: 87,  ecoScore: 75 },
  { id: 7, name: "Transport Auth", email: "tnauth@gov.in",        role: "authority", status: "active",   joined: "2025-01-01", trips: 0,   ecoScore: null },
  { id: 8, name: "Mohan K.",       email: "mohan@gmail.com",      role: "commuter",  status: "suspended",joined: "2025-05-10", trips: 12,  ecoScore: 55 },
];

const ROLE_BADGE = {
  commuter:  "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  authority: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  admin:     "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};
const STATUS_BADGE = {
  active:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive:  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminUsersPage() {
  const [users, setUsers]     = useState(MOCK_USERS);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRole] = useState("all");
  const [openMenu, setMenu]   = useState(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const changeStatus = (id, status) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, status } : u));
    toast.success(`User ${status}`);
    setMenu(null);
  };

  const changeRole = (id, role) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));
    toast.success("Role updated");
    setMenu(null);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users size={21} className="text-purple-600" /> User Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} registered users · {users.filter(u => u.status === "active").length} active</p>
        </div>
        <button onClick={() => toast.success("Export started — CSV will download shortly")}
          className="btn-secondary flex items-center gap-2 text-sm py-2">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total users",      value: users.length,                                           color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
          { label: "Active",           value: users.filter(u => u.status === "active").length,        color: "text-green-600",   bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Commuters",        value: users.filter(u => u.role === "commuter").length,        color: "text-slate-600",   bg: "bg-slate-50 dark:bg-slate-800" },
          { label: "Authorities",      value: users.filter(u => u.role === "authority").length,       color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
              <Shield size={16} className={s.color} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2">
          {["all","commuter","authority","admin"].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all capitalize ${roleFilter === r ? "bg-primary-600 text-white border-primary-600" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300 bg-white dark:bg-slate-900"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                {["User","Email","Role","Status","Joined","Trips","Eco Score","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.split(" ").map(w => w[0]).join("").slice(0,2)}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{u.joined}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">{u.trips || "—"}</td>
                  <td className="px-4 py-3">
                    {u.ecoScore
                      ? <span className={`text-xs font-bold ${u.ecoScore >= 85 ? "text-green-600" : u.ecoScore >= 70 ? "text-amber-600" : "text-slate-400"}`}>{u.ecoScore}/100</span>
                      : <span className="text-xs text-slate-300 dark:text-slate-600">N/A</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button onClick={() => setMenu(openMenu === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                        <MoreVertical size={15} />
                      </button>
                      {openMenu === u.id && (
                        <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xl z-20 py-1 min-w-[160px] animate-fade-in">
                          {["commuter","authority","admin"].map(r => (
                            <button key={r} onClick={() => changeRole(u.id, r)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 capitalize">
                              <Shield size={12} /> Set as {r}
                            </button>
                          ))}
                          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                          {u.status !== "active"    && <button onClick={() => changeStatus(u.id,"active")}    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"><UserCheck size={12} />Activate</button>}
                          {u.status !== "suspended" && <button onClick={() => changeStatus(u.id,"suspended")} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><UserX size={12} />Suspend</button>}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">No users match your search.</div>
        )}
      </div>
    </div>
  );
}
