/**
 * AppLayout — main shell wrapping sidebar + topbar + page content
 */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-64"}`}>
        <Topbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
