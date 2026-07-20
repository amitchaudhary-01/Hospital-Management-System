import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { House , CalendarDays } from 'lucide-react';



const PatientLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/patient/home",
      icon: <House/>
      
    },
    {
      name: "My Appointments",
      path: "/patient/appointments",
      icon: <CalendarDays/>
      
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* MOBILE TOPBAR */}
      <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-sm">
            HC
          </div>
          <span className="font-bold text-lg tracking-tight">
            Hospital <span className="text-sky-400">Care</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* BACKDROP FOR MOBILE MENU */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* INDEPENDENTLY SCROLLABLE FIXED SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 h-screen bg-slate-900 text-white flex flex-col justify-between overflow-y-auto overscroll-contain transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP SECTION: LOGO & NAV LINKS */}
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-5 flex items-center border-b border-slate-800/80 shrink-0 sticky top-0 bg-slate-900 z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center font-black text-slate-900 shadow-md shadow-sky-500/20">
                HC
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight tracking-wide">
                  Hospital <span className="text-sky-400">Care</span>
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Patient Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-1">Main Menu</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs md:text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-xs"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM SECTION: USER PROFILE & LOGOUT */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900 shrink-0 space-y-2 mt-auto sticky bottom-0 z-10">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "-"}
            </div>
            <div className="overflow-hidden leading-tight">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || "------"}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || "------@care.com"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wider transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="md:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Sticky Header */}
        <header className="hidden md:flex h-14 bg-white border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Portal</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Overview</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Active
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;