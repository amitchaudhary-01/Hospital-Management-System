import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Calendar, Stethoscope, Mail, AlertCircle, RefreshCw } from 'lucide-react';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/appointments/my');

        if (!isMounted) return;

        if (response.data?.appointments) {
          setAppointments(response.data.appointments);
        } else if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else {
          setError('Data format received from server is invalid.');
        }
      } catch (err) {
        if (!isMounted) return;
        setError(
          err.response?.data?.message || 'Failed to establish connection to the server.'
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function returning Tailwind classes for badge status
  const getStatusBadgeClass = (status = '') => {
    const lower = status.toLowerCase();
    if (lower === 'approved' || lower === 'confirmed') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    }
    if (lower === 'cancelled' || lower === 'rejected') {
      return 'bg-rose-50 text-rose-700 border-rose-200/60';
    }
    // Default Pending
    return 'bg-amber-50 text-amber-700 border-amber-200/60';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-sky-600" />
            <span>My Appointments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage your scheduled consultations and medical status.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 w-fit">
          Total: {appointments.length}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading your appointments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6 flex items-center gap-3 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && appointments.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Appointments Found</h3>
          <p className="text-xs text-slate-400 mt-1">You haven't booked any medical appointments yet.</p>
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && appointments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Reason / Consultation</th>
                  <th className="py-3.5 px-6">Doctor Details</th>
                  <th className="py-3.5 px-6">Specialization</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {appointments.map((item) => {
                  const badgeClass = getStatusBadgeClass(item.status);

                  return (
                    <tr 
                      key={item._id} 
                      className="hover:bg-slate-50/60 transition-colors duration-150"
                    >
                      {/* Reason Column */}
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {item.reason || 'General Consultation'}
                      </td>

                      {/* Doctor Details Column */}
                      <td className="py-4 px-6">
                        {item.doctor ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 text-slate-800 font-medium">
                              <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>{item.doctor.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>{item.doctor.email}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs italic text-slate-400">
                            No doctor assigned yet
                          </span>
                        )}
                      </td>

                      {/* Specialization Column */}
                      <td className="py-4 px-6">
                        {item.doctor?.specialization ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                            {item.doctor.specialization}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border capitalize ${badgeClass}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {item.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;