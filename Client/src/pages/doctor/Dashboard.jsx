import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  UserCheck,
  FileText,
  Check,
  AlertCircle,
  Activity,
  Stethoscope,
  RefreshCw,
  Phone,
  User,
  Download,
} from "lucide-react";

import API from "../../api/axios";
import { downloadPrescription } from "../../utils/prescriptionUtils";

// Helper: Extract prescription ID regardless of API nesting
const getPrescriptionId = (appt) => {
  if (!appt) return null;
  if (typeof appt.prescriptionId === "string") return appt.prescriptionId;
  if (appt.prescriptionId?._id) return appt.prescriptionId._id;
  if (typeof appt.prescription === "string") return appt.prescription;
  if (appt.prescription?._id) return appt.prescription._id;
  return null;
};

// Helper: Status badge styling
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    case "confirmed":
    case "booked":
      return "bg-blue-50 text-blue-700 border-blue-200/80";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200/80";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200/80";
  }
};

const isPendingOrConfirmed = (status) => {
  const s = status?.toLowerCase();
  return s === "pending" || s === "confirmed" || s === "booked";
};

// ================================
// REUSABLE ACTION BUTTONS
// ================================
const AppointmentActions = ({ appt, downloadingId, onStatusUpdate, onNavigate, onDownload, isMobile }) => {
  const prescriptionId = getPrescriptionId(appt);
  const active = isPendingOrConfirmed(appt.status);

  if (!active && !prescriptionId) {
    return (
      <span className={`text-xs text-slate-400 my-auto ${isMobile ? "text-center w-full" : ""}`}>
        No actions available
      </span>
    );
  }

  return (
    <div className={`flex ${isMobile ? "flex-wrap w-full" : "justify-end"} gap-2`}>
      {active && (
        <>
          <button
            onClick={() => onStatusUpdate(appt._id, "completed")}
            className={`${
              isMobile ? "flex-1" : ""
            } inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer`}
          >
            <Check className="w-3.5 h-3.5" /> Mark Done
          </button>
          <button
            onClick={() => onNavigate(`/doctor/prescriptions?appointmentId=${appt._id}`)}
            className={`${
              isMobile ? "flex-1" : ""
            } inline-flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border border-sky-200 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer`}
          >
            <FileText className="w-3.5 h-3.5" /> Prescribe
          </button>
        </>
      )}

      {prescriptionId && (
        <button
          onClick={() => onDownload(prescriptionId)}
          disabled={downloadingId === prescriptionId}
          className={`${
            isMobile ? "w-full" : ""
          } inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50`}
        >
          <Download className={`w-3.5 h-3.5 ${downloadingId === prescriptionId ? "animate-bounce" : ""}`} />
          {downloadingId === prescriptionId ? "Preparing PDF..." : "Download PDF"}
        </button>
      )}
    </div>
  );
};

// ================================
// DASHBOARD COMPONENT
// ================================
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch Dashboard Data
  const fetchDashboard = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);

    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/doctor/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (isMountedRef.current) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      if (!isSilent && isMountedRef.current) {
        toast.error(err.response?.data?.message || "Failed to fetch dashboard data");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  }, []);

  // Initial Fetch & Active Polling (Pauses when tab is hidden)
  useEffect(() => {
    fetchDashboard(false);

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchDashboard(true);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchDashboard]);

  // Handle Status Updates
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/doctor/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Appointment marked as ${newStatus}`);
      fetchDashboard(true);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // Handle Download
  const handleDownload = async (prescriptionId) => {
    setDownloadingId(prescriptionId);
    try {
      await downloadPrescription(prescriptionId);
    } finally {
      if (isMountedRef.current) setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs px-6 py-5 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-sky-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Syncing Doctor Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-7">
        
        {/* WELCOME BANNER */}
        <section
          data-aos="fade-down"
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white shadow-md shadow-sky-500/10 p-5 sm:p-7 md:p-9 lg:p-10"
        >
          <div className="absolute -right-16 -top-16 w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -bottom-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-sky-200" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-100">
                Doctor Workstation
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Welcome back,{" "}
              <span className="text-sky-200">
                {data?.doctorName || data?.name ? `Dr. ${data.doctorName || data.name}` : "Doctor"}
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-sky-100/90 leading-relaxed max-w-xl">
              Live Overview of daily appointments, patient queue, and medical schedules.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => fetchDashboard(false)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 bg-white text-sky-700 hover:bg-sky-50 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Syncing..." : "Sync Live Data"}
              </button>

              <span className="text-[11px] text-sky-100/80 flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Auto-sync active (15s)
              </span>
            </div>
          </div>
        </section>

        {/* STATS CARDS */}
        {data && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            <div
              onClick={() => navigate("/doctor/appointments")}
              data-aos="fade-up"
              data-aos-delay="0"
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-200 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Scheduled</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                  {data.stats?.todayCount ?? data.todayAppointments?.length ?? 0}
                </p>
              </div>
            </div>

            <div
              onClick={() => navigate("/doctor/appointments")}
              data-aos="fade-up"
              data-aos-delay="100"
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Pending / Confirmed</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{data.stats?.pendingCount ?? 0}</p>
              </div>
            </div>

            <div
              onClick={() => navigate("/doctor/appointments")}
              data-aos="fade-up"
              data-aos-delay="200"
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex items-center gap-4 cursor-pointer sm:col-span-2 lg:col-span-1"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{data.stats?.completedCount ?? 0}</p>
              </div>
            </div>
          </section>
        )}

        {/* TODAY'S SCHEDULE */}
        <section
          data-aos="fade-up"
          className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Today's Schedule</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 ml-11">Manage your appointments and patient visits.</p>
              </div>

              <span className="self-start sm:self-auto bg-sky-50 text-sky-700 border border-sky-100 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full">
                {data?.todayAppointments?.length || 0} Scheduled
              </span>
            </div>
          </div>

          {!data?.todayAppointments || data.todayAppointments.length === 0 ? (
            <div className="p-5 sm:p-10">
              <div className="text-center py-10 sm:py-14 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto shadow-xs">
                  <AlertCircle className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-700 mt-4">No appointments scheduled for today</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Your schedule is currently clear.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile View Cards */}
              <div className="block md:hidden p-3 sm:p-5 space-y-3">
                {data.todayAppointments.map((appt) => (
                  <div key={appt._id} className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-white border border-sky-100 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Patient</p>
                          <p className="font-bold text-slate-900 text-sm sm:text-base truncate">
                            {appt.patient?.name || appt.patientName || "N/A"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200/60">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Contact
                        </p>
                        <p className="text-xs font-medium text-slate-700 mt-0.5 truncate">
                          {appt.patient?.contactNumber || appt.contactNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                          <User className="w-3 h-3" /> Gender
                        </p>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">
                          {appt.patient?.gender || appt.gender || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                      <AppointmentActions
                        appt={appt}
                        downloadingId={downloadingId}
                        onStatusUpdate={handleStatusUpdate}
                        onNavigate={navigate}
                        onDownload={handleDownload}
                        isMobile={true}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80">
                      <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                      <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                      <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gender</th>
                      <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.todayAppointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900">
                                {appt.patient?.name || appt.patientName || "N/A"}
                              </p>
                              <p className="text-[10px] text-slate-400">Patient</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-slate-600">
                          {appt.patient?.contactNumber || appt.contactNumber || "N/A"}
                        </td>
                        <td className="py-4 px-5 text-sm text-slate-600">
                          {appt.patient?.gender || appt.gender || "N/A"}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(
                              appt.status
                            )}`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <AppointmentActions
                            appt={appt}
                            downloadingId={downloadingId}
                            onStatusUpdate={handleStatusUpdate}
                            onNavigate={navigate}
                            onDownload={handleDownload}
                            isMobile={false}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

      </div>
    </div>
  );
};

export default Dashboard;