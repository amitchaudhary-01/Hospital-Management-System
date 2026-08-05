import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Calendar, Stethoscope, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import Pagination from '../../components/Pagination';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Records per page
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get(`/appointments/my?page=${page}&limit=${limit}`);

        if (!isMounted) return;

        if (response.data?.appointments) {
          setAppointments(response.data.appointments);
          
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
        } else if (Array.isArray(response.data)) {
          setAppointments(response.data);
          setPagination({
            totalCount: response.data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          });
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
  }, [page, limit]);

  const getStatusBadgeClass = (status = '') => {
    const lower = status.toLowerCase();
    if (lower === 'approved' || lower === 'confirmed') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    }
    if (lower === 'cancelled' || lower === 'rejected') {
      return 'bg-rose-50 text-rose-700 border-rose-200/60';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200/60';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Section */}
      <div data-aos="fade-down" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 shrink-0" />
            <span>My Appointments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage your scheduled consultations and medical status.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 w-fit self-start sm:self-auto">
          Total Records: {pagination.totalCount || appointments.length}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div data-aos="fade-in" className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading your appointments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div data-aos="fade-in" className="bg-rose-50 rounded-2xl border border-rose-200 p-4 sm:p-6 flex items-center gap-3 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && appointments.length === 0 && (
        <div data-aos="fade-in" className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Appointments Found</h3>
          <p className="text-xs text-slate-400 mt-1">You haven't booked any medical appointments yet.</p>
        </div>
      )}

      {/* Data Section */}
      {!loading && !error && appointments.length > 0 && (
        <div data-aos="fade-up" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* MOBILE VIEW: Cards */}
          <div className="block md:hidden divide-y divide-slate-100">
            {appointments.map((item, index) => {
              const badgeClass = getStatusBadgeClass(item.status);

              return (
                <div key={item._id} data-aos="fade-up" data-aos-delay={index * 50} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-800 text-sm">
                      {item.reason || 'General Consultation'}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${badgeClass}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {item.status || 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs text-slate-500 font-medium">Doctor:</div>
                    {item.doctor ? (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex items-center gap-2 text-slate-800 text-xs font-medium">
                          <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{item.doctor.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="truncate">{item.doctor.email}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-400 block">
                        No doctor assigned yet
                      </span>
                    )}
                  </div>

                  {item.doctor?.specialization && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">Specialization:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {item.doctor.specialization}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* DESKTOP/TABLET VIEW: Table */}
          <div className="hidden md:block overflow-x-auto">
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
                {appointments.map((item, index) => {
                  const badgeClass = getStatusBadgeClass(item.status);

                  return (
                    <tr 
                      key={item._id} 
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                      className="hover:bg-slate-50/60 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {item.reason || 'General Consultation'}
                      </td>
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
                      <td className="py-4 px-6">
                        {item.doctor?.specialization ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                            {item.doctor.specialization}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
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

          {/* Clean Substituted Reusable Pagination Component */}
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            hasPrevPage={pagination.hasPrevPage}
            hasNextPage={pagination.hasNextPage}
            loading={loading}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
};

export default Appointment;