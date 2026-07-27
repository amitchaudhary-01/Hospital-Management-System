import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-400 border-b border-slate-200">
       <div className="bg-slate-200 text-gray-500 text-xs px-4 md:px-24 py-1 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-gray-100 text-center sm:text-left">
        <div className="flex gap-4 md:gap-6">
          <a href="mailto:eBook@gmail.com" className="hover:text-indigo-600 transition flex items-center gap-1">
            📧 HospitalCare@gmail.com
          </a>
          <a href="tel:+9779821005569" className="hover:text-indigo-600 transition flex items-center gap-1">
            📞 +977 9821005569
          </a>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-4">
          <span>Sun - Fri : 9am - 8pm</span>
          <Link
            to="https://maps.google.com/?q=Butwal,Rupandehi,Nepal"
            target="_blank"
            className="hover:text-indigo-600 transition flex items-center gap-1"
          >
            📍Butwal, Rupandehi, Nepal
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            +
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 flex items-center">
            Hospital<span className="font-bold text-blue-600 ml-1">Care</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#home" className="hover:text-blue-600 transition-colors">
            Home
          </a>
          <a href="#about" className="hover:text-blue-600 transition-colors">
            About
          </a>
          <Link to="/patient/doctors" className="hover:text-blue-600 transition-colors">
            Doctor
          </Link>
          <a href="#process" className="hover:text-blue-600 transition-colors">
            How it works
          </a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">
            Contact
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            Create an account
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;