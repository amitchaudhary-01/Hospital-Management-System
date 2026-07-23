import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Admin Navigation Items
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "All Doctors",
      path: "/admin/doctors",
      icon: Stethoscope,
    },
    {
      name: "All Patients",
      path: "/admin/patients",
      icon: Users,
    },
    {
      name: "All Appointments",
      path: "/admin/appointments",
      icon: CalendarDays,
    },
    {
        name: "Create Doctor",
        path:"/admin/doctor",
        icon: UserRoundPlus
    }
  ];

  // Dynamic NavLink Styling
  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-3 group ${
      isActive
        ? "bg-blue-50 text-blue-600 font-semibold border border-blue-100 shadow-xs"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">
      
      {/* MOBILE TOPBAR */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-800 tracking-tight">
            Hospital <span className="text-blue-600">Care</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* BACKDROP FOR MOBILE MENU */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 bottom-0 z-50
          w-64 h-screen bg-white border-r border-slate-200 p-5 
          flex flex-col justify-between shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-none tracking-tight text-slate-800">
                  Hospital <span className="text-blue-600">Care</span>
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold mt-1">
                  Admin Portal
                </p>
              </div>
            </div>

            <button
              onClick={closeMobileMenu}
              className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-500 group-hover:text-slate-800"
                        }`}
                      />
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Section */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden leading-tight">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || "admin@care.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>LOG OUT</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Desktop Sticky Header */}
        <header className="hidden md:flex h-14 bg-white border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Admin Portal</span>
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

        {/* Page View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;