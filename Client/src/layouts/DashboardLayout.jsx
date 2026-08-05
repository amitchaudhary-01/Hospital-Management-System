import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Pill,
  User,
  LogOut,
  Menu,
  X,
  Stethoscope,
} from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // Dynamic NavLink Class Generator (Light Theme)
  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-3 group ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-100 shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const navItems = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { to: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
    { to: '/doctor/profile', label: 'Doctor Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
                <h1 className="font-bold text-base leading-tight tracking-wide text-slate-800">
                  Hospital <span className="text-sky-600">Care</span>
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  Doctor Portal
                </p>
              </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Backdrop Overlay for Mobile Navigation */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 bottom-0 z-50
          w-64 h-screen bg-white border-r border-slate-200 p-5 
          flex flex-col justify-between shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between px-2 pt-1" data-aos="fade-down">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              
               <div>
                <h1 className="font-bold text-base leading-tight tracking-wide text-slate-800">
                  Hospital <span className="text-sky-600">Care</span>
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  Doctor Portal
                </p>
              </div>
            </div>
            
            <button
              onClick={closeSidebar}
              className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5" data-aos="fade-right" data-aos-delay="100">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={navLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-800'}`} />
                      <span>{item.label}</span>
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
        <div className="pt-4 border-t border-slate-200 space-y-3" data-aos="fade-up" data-aos-delay="200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 min-w-0 bg-slate-50 p-4 sm:p-6 lg:p-8 overflow-y-auto" data-aos="fade-in" data-aos-delay="150">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;