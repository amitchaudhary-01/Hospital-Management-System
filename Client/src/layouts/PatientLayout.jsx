import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { House, CalendarDays, FileText, Menu, X, LogOut, User } from "lucide-react";

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
      icon: <House className="w-4 h-4" />,
    },
    {
      name: "My Appointments",
      path: "/patient/appointments",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      name: "My Prescriptions",
      path: "/patient/prescriptions",
      icon: <FileText className="w-4 h-4" />,
    },
    // {
    //   name: "Doctors",
    //   path:"/patient/doctors",
    //   icon: <User className="w-4 h-4"/>
    // }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* MOBILE TOPBAR */}
      <header className="md:hidden bg-white text-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-sm shadow-sm">
            HC
          </div>
          <span className="font-bold text-base tracking-tight text-slate-800">
            Hospital <span className="text-sky-600">Care.</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* BACKDROP FOR MOBILE MENU */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* INDEPENDENTLY SCROLLABLE FIXED SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 h-screen bg-white border-r border-slate-200 text-slate-800 flex flex-col justify-between overflow-y-auto overscroll-contain transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP SECTION: LOGO & NAV LINKS */}
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-5 flex items-center border-b border-slate-200 shrink-0 sticky top-0 bg-white z-10" data-aos="fade-down">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center font-black text-white shadow-sm">
                HC
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight tracking-wide text-slate-800">
                  Hospital <span className="text-sky-600">Care</span>
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  Patient Portal
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1" data-aos="fade-right" data-aos-delay="100">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">
              Main Menu
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-sky-50 text-sky-600 border border-sky-100 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
        <div className="p-3 border-t border-slate-200 bg-white shrink-0 space-y-2 mt-auto sticky bottom-0 z-10" data-aos="fade-up" data-aos-delay="200">
          <NavLink
            to="/patient/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition group"
          >
            <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 font-bold text-xs shrink-0 group-hover:border-sky-400">
              {user?.name ? user.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div className="overflow-hidden leading-tight">
              <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-sky-600 transition">
                {user?.name || "Patient Profile"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || "patient@care.com"}
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-300 text-rose-600 border border-rose-200 py-2 px-3 rounded-xl text-xs font-semibold tracking-wider transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOG OUT</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="md:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Sticky Header */}
        <header className="hidden md:flex h-14 bg-white border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Patient Portal</span>
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

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto bg-slate-50" data-aos="fade-in" data-aos-delay="150">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;