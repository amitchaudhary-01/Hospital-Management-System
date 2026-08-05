import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Download,
  ArrowUpRight
} from "lucide-react";
import API from '../../api/axios';
import useAuth from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30d");

  const getDynamicGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/dashboard");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      setError(error.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Loading dashboard overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Doctors",
      value: stats?.totalDoctors || 0,
      change: "+4 this month",
      icon: Stethoscope,
      bgIcon: "bg-blue-50 text-blue-600 border-blue-100",
      link: "/admin/doctors",
    },
    {
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      change: "+12% vs last month",
      icon: Users,
      bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-100",
      link: "/admin/patients",
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments || 0,
      change: "Active schedule flow",
      icon: Calendar,
      bgIcon: "bg-purple-50 text-purple-600 border-purple-100",
      link: "/admin/appointments",
    },
    {
      title: "Pending Action",
      value: stats?.pendingAppointments || 0,
      change: "Requires attention",
      icon: Clock,
      bgIcon: "bg-amber-50 text-amber-600 border-amber-100",
      link: "/admin/appointments/pending",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER SECTION WITH FILTERS & EXPORT */}
      <div 
        data-aos="fade-down" 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {getDynamicGreeting()}, {user?.name || "Administrator"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here is what is happening across your hospital management system today.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
            {["7d", "30d", "12m"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === range
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button 
            onClick={() => alert("Exporting report...")}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              data-aos="fade-up"
              data-aos-delay={index * 100} // Staggered animation effect
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${stat.bgIcon}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-4">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value.toLocaleString()}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                <span>View details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* DETAILED BREAKDOWN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Appointment Pipeline Status Cards */}
        <div 
          data-aos="fade-right" 
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Appointment Analytics</h2>
              <p className="text-xs text-slate-500">Real-time breakdown of patient appointment statuses</p>
            </div>
            <Link 
              to="/admin/appointments" 
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Manage all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin/appointments/pending"
              data-aos="fade-up"
              data-aos-delay="0"
              className="bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/60 transition p-4 rounded-xl block group"
            >
              <div className="flex items-center justify-between text-amber-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-700">
                {stats?.pendingAppointments || 0}
              </p>
              <p className="text-[11px] text-amber-600/80 mt-1">Awaiting approval</p>
            </Link>

            <Link
              to="/admin/appointments"
              data-aos="fade-up"
              data-aos-delay="100"
              className="bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200/60 transition p-4 rounded-xl block group"
            >
              <div className="flex items-center justify-between text-blue-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Confirmed</span>
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {stats?.confirmedAppointments || 0}
              </p>
              <p className="text-[11px] text-blue-600/80 mt-1">Scheduled visits</p>
            </Link>

            <Link
              to="/admin/appointments"
              data-aos="fade-up"
              data-aos-delay="200"
              className="bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200/60 transition p-4 rounded-xl block group"
            >
              <div className="flex items-center justify-between text-emerald-800 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                {stats?.completedAppointments || 0}
              </p>
              <p className="text-[11px] text-emerald-600/80 mt-1">Successfully treated</p>
            </Link>
          </div>
        </div>

        {/* Cancelled Metrics Card */}
        <Link
          to="/admin/appointments"
          data-aos="fade-left"
          className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:border-slate-300 transition flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Cancellations</h2>
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500">Total appointments cancelled within the current timeframe cycle.</p>
          </div>

          <div className="my-6">
            <span className="text-4xl font-extrabold text-rose-600 tracking-tight">
              {stats?.cancelledAppointments || 0}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Requires review if anomaly spikes</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-rose-600 transition-colors">
            <span>Inspect cancelled list</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

      </div>
    </div>
  );
};

export default AdminDashboard;