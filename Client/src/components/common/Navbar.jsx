import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Contact from "./ContactUs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Helper to handle smooth scrolling for hash links if on the homepage
  const handleAnchorClick = (e, targetId) => {
    closeMenu();
    if (location.pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Top Info Bar */}
      <div className="bg-slate-100 text-gray-600 text-xs px-4 md:px-8 py-2 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-slate-200">
        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          <a
            href="mailto:HospitalCare@gmail.com"
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            📧 HospitalCare@gmail.com
          </a>
          <a
            href="tel:+9779821005569"
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            📞 +977 9821005569
          </a>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-4">
          <span>Sun - Fri : 9am - 8pm</span>
          <a
            href="https://maps.google.com/?q=Butwal,Rupandehi,Nepal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            📍 Butwal, Rupandehi, Nepal
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand / Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 z-10">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              +
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Hospital<span className="text-blue-600 ml-0.5">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">  Home </Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">  About</Link>
            <Link to="/doctors" className="hover:text-blue-600 transition-colors"> Doctor </Link>
    
            <Link to="/process" className="hover:text-blue-600 transition-colors">How It work</Link>

            <Link to="/contact" className="hover:text-blue-600 transition-colors">  Contact</Link>
            
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"> Log in </Link>
            <Link to="/signup" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20"> Create an account </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                // Close Icon (X)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-slate-200 py-4 space-y-4">
            <div className="flex flex-col space-y-2 px-2 text-base font-medium text-slate-700">
              <Link
                to="/"
                onClick={closeMenu}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <a
                href="/#about"
                onClick={(e) => handleAnchorClick(e, "about")}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <Link
                to="/patient/doctors"
                onClick={closeMenu}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                Doctor
              </Link>
              <a
                href="/#process"
                onClick={(e) => handleAnchorClick(e, "process")}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                How it works
              </a>
              <Link
                to="/contact"
                onClick={closeMenu}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2 px-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                Create an account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;