import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from '../../api/axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD STATS
  // ==========================================
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await API.get("/admin/dashboard");

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  // ==========================================
  // STAT CARDS WITH ROUTE LINKS
  // ==========================================
  const statCards = [
    {
      title: "Total Doctors",
      value: stats?.totalDoctors || 0,
      change: "Registered doctors",
      color: "border-l-blue-500 hover:bg-slate-50",
      link: "/admin/doctors",
    },
    {
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      change: "Registered patients",
      color: "border-l-emerald-500 hover:bg-slate-50",
      link: "/admin/patients",
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments || 0,
      change: "All appointments",
      color: "border-l-purple-500 hover:bg-slate-50",
      link: "/admin/appointments",
    },
    {
      title: "Pending Appointments",
      value: stats?.pendingAppointments || 0,
      change: "Waiting for confirmation",
      color: "border-l-amber-500 hover:bg-slate-50",
      link: "/admin/appointments/pending",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
        <p className="text-sm text-slate-500">
          Welcome back, Administrator. Here is what is happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className={`bg-white p-5 rounded-lg shadow-sm border border-slate-200 border-l-4 transition-all duration-200 cursor-pointer block ${stat.color}`}
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
          </Link>
        ))}
      </div>

      {/* Appointment Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Appointment Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
          {/* Pending */}
          <Link
            to="/admin/appointments/pending"
            className="bg-amber-50 hover:bg-amber-100/70 transition p-4 rounded-lg block cursor-pointer"
          >
            <p className="text-sm font-medium text-amber-900">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
              {stats?.pendingAppointments || 0}
            </p>
          </Link>

          {/* Confirmed */}
          <Link
            to="/admin/appointments"
            className="bg-blue-50 hover:bg-blue-100/70 transition p-4 rounded-lg block cursor-pointer"
          >
            <p className="text-sm font-medium text-blue-900">Confirmed</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats?.confirmedAppointments || 0}
            </p>
          </Link>

          {/* Completed */}
          <Link
            to="/admin/appointments"
            className="bg-emerald-50 hover:bg-emerald-100/70 transition p-4 rounded-lg block cursor-pointer"
          >
            <p className="text-sm font-medium text-emerald-900">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats?.completedAppointments || 0}
            </p>
          </Link>
        </div>
      </div>

      {/* Cancelled Appointments */}
      <Link
        to="/admin/appointments"
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 block hover:border-slate-300 transition cursor-pointer"
      >
        <h2 className="text-lg font-semibold text-slate-800">
          Cancelled Appointments
        </h2>
        <p className="text-3xl font-bold text-rose-600 mt-2">
          {stats?.cancelledAppointments || 0}
        </p>
      </Link>
    </div>
  );
};

export default AdminDashboard;