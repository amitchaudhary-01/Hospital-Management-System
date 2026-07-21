import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // Helper function for active link styling
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2 ${
      isActive
        ? 'bg-[#00ffc3]/15 text-[#00ffc3] border border-[#00ffc3]/20'
        : 'bg-white/5 hover:bg-[#00ffc3]/10 text-gray-200 hover:text-[#00ffc3]'
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0d171a] text-white font-sans relative overflow-x-hidden">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111e22] border-b border-white/10 sticky top-0 z-30">
        <h2 className="text-lg font-bold text-[#00ffc3] tracking-wide">
          Doctor Panel
        </h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            /* Close Icon */
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Hamburger Icon */
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Backdrop Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed md:static top-0 left-0 bottom-0 z-50
          w-64 bg-[#111e22] border-r border-white/10 p-6 
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#00ffc3] tracking-wide">
              Doctor Panel
            </h2>
            {/* Close button inside sidebar on mobile */}
            <button
              onClick={closeSidebar}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            <NavLink to="/doctor/dashboard" onClick={closeSidebar} className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/doctor/appointments" onClick={closeSidebar} className={navLinkClass}>
              Appointments
            </NavLink>
            <NavLink to="/doctor/prescriptions" onClick={closeSidebar} className={navLinkClass}>
              Prescriptions
            </NavLink>
            <NavLink to="/doctor/profile" onClick={closeSidebar} className={navLinkClass}>
              Doctor Profile
            </NavLink>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
        >
          Logout
        </button>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;