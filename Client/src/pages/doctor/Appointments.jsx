import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  CalendarDays, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from "lucide-react";
import API from "../../api/axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/appointments/doctor", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Safely extract array depending on backend response structure
      const data = res.data;
      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (Array.isArray(data?.appointments)) {
        setAppointments(data.appointments);
      } else if (Array.isArray(data?.data)) {
        setAppointments(data.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error(err.response?.data?.message || "Failed to fetch appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);



const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await API.patch(`/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success(`Appointment marked as ${newStatus}`);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sky-600 font-semibold animate-pulse flex items-center gap-2 text-sm">
          <Clock className="w-5 h-5 animate-spin" /> Fetching appointments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Appointments Directory
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            View and manage patient appointment requests.
          </p>
        </div>
        <span className="self-start sm:self-center bg-sky-50 text-sky-700 border border-sky-100 text-xs font-bold px-3 py-1 rounded-full">
          Total: {Array.isArray(appointments) ? appointments.length : 0}
        </span>
      </div>

      {/* Empty State */}
      {!Array.isArray(appointments) || appointments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Appointments Found</h3>
          <p className="text-xs text-slate-400 mt-1">You currently have no scheduled appointments.</p>
        </div>
      ) : (
        /* Appointment Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => {
            const patient = appt.patientId || appt.patient || {};
            const patientName = patient.name || appt.patientName || "N/A";
            const contact = patient.phone || patient.contactNumber || appt.contactNumber || "N/A";
            const gender = patient.gender || appt.gender || "N/A";
            const age = patient.age || appt.age || "N/A";

            return (
              <div
                key={appt._id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Top Bar */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        appt.status === "Completed" || appt.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : appt.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {appt.status}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
                      {appt.date || "Today"}
                    </span>
                  </div>

                  {/* Patient Info Header */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold text-sm shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {patientName}
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {gender} • {age !== "N/A" ? `${age} yrs` : "Age N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact}</span>
                    </div>

                    {appt.timeSlot && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Slot: {appt.timeSlot}</span>
                      </div>
                    )}

                    {appt.reason && (
                      <div className="flex items-start gap-2 pt-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-500 line-clamp-2">
                          <strong className="text-slate-700 font-medium">Reason:</strong> {appt.reason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                {appt.status === "Pending" && (
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusUpdate(appt._id, "Confirmed")}
                      className="inline-flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appt._id, "Cancelled")}
                      className="inline-flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Appointments;