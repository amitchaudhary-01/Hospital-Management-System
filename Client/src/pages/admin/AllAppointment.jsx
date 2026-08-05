import React, { useEffect, useState, useCallback } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';
import { 
  Calendar, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  X, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Eye,
  ShieldAlert
} from 'lucide-react';

const AllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Modal States
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Appointments from Server
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page,
        limit,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'ALL' && { status: statusFilter })
      });

      const response = await API.get(`/admin/appointments?${params.toString()}`);

      if (response.data?.success) {
        setAppointments(response.data.appointments || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setError('Invalid data format received from the server.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch appointments list.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter]);

  // Fetch data on query params update
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Reset page on search or status change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  // Update Appointment Status
  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingStatus(id);
      await API.put(`/admin/appointment/${id}/status`, { status });
      toast.success(`Appointment marked as ${status.toLowerCase()}`);
      
      setAppointments((prev) =>
        prev.map((apt) => (apt._id === id ? { ...apt, status } : apt))
      );

      if (selectedAppointment?._id === id) {
        setSelectedAppointment((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Delete Appointment
  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    try {
      setDeleting(true);
      await API.delete(`/admin/appointment/${appointmentToDelete._id}`);
      toast.success('Appointment record deleted successfully');
      
      fetchAppointments();
      setAppointmentToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete appointment');
    } finally {
      setDeleting(false);
    }
  };

  // Status Badge Component
  const getStatusBadge = (status) => {
    const normStatus = (status || 'PENDING').toUpperCase();

    switch (normStatus) {
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Cancelled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Confirmed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-6 py-4">
      
      {/* Header & Controls */}
      <div 
        data-aos="fade-down"
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs"
      >
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 shrink-0" />
            <span>All Appointments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor and manage all doctor-patient bookings across the system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Status Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctor or patient..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <span className="text-xs text-center font-semibold px-3 py-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
            Total Records: {pagination.totalItems || appointments.length}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div data-aos="fade-in" className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading appointments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div data-aos="fade-in" className="bg-rose-50 rounded-2xl border border-rose-200 p-4 sm:p-6 flex items-center gap-3 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && appointments.length === 0 && (
        <div data-aos="fade-in" className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Appointments Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No records match your selected filters.'
              : 'There are no appointments booked yet.'}
          </p>
        </div>
      )}

      {/* Appointments List Section */}
      {!loading && !error && appointments.length > 0 && (
        <div data-aos="fade-up" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* MOBILE / TABLET CARD VIEW */}
          <div className="block md:hidden divide-y divide-slate-100">
            {appointments.map((apt, index) => {
              const patient = apt.patient || apt.userData || {};
              const doctor = apt.doctor || apt.docData || {};

              const patientName = patient.name || apt.patientName || 'Anonymous';
              const doctorName = doctor.name || apt.doctorName || 'Unassigned Doctor';
              const doctorSpec = doctor.specialization || doctor.speciality || 'General';

              const dateDisplay = apt.date || apt.slotDate || 'N/A';
              const timeDisplay = apt.timeSlot || apt.slotTime || 'N/A';
              const normStatus = (apt.status || '').toUpperCase();

              return (
                <div key={apt._id} data-aos="fade-up" data-aos-delay={index * 50} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                        {patientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm leading-tight">{patientName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{patient.email || 'N/A'}</p>
                      </div>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Doctor</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{doctorName}</p>
                      <p className="text-slate-500 text-[11px]">{doctorSpec}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Date & Time</p>
                      <p className="font-medium text-slate-700 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{dateDisplay}</span>
                      </p>
                      <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{timeDisplay}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-800">
                      Fees: ${apt.amount || doctor.fees || '0'}
                    </span>

                    <div className="flex items-center gap-1">
                      {normStatus !== 'COMPLETED' && normStatus !== 'CANCELLED' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                            disabled={updatingStatus === apt._id}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Mark Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                            disabled={updatingStatus === apt._id}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="View Info"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setAppointmentToDelete(apt)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Patient</th>
                  <th className="py-3.5 px-6">Doctor</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Fees</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {appointments.map((apt, index) => {
                  const patient = apt.patient || apt.userData || {};
                  const doctor = apt.doctor || apt.docData || {};

                  const patientName = patient.name || apt.patientName || 'Anonymous';
                  const doctorName = doctor.name || apt.doctorName || 'Unassigned Doctor';
                  const doctorSpec = doctor.specialization || doctor.speciality || 'General';

                  const dateDisplay = apt.date || apt.slotDate || 'N/A';
                  const timeDisplay = apt.timeSlot || apt.slotTime || 'N/A';
                  const normStatus = (apt.status || '').toUpperCase();

                  return (
                    <tr key={apt._id} data-aos="fade-up" data-aos-delay={index * 50} className="hover:bg-slate-50/60 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                            {patientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">{patientName}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{patient.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs shrink-0">
                            {doctorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">{doctorName}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{doctorSpec}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{dateDisplay}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{timeDisplay}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs font-semibold text-slate-800">
                        ${apt.amount || doctor.fees || '0'}
                      </td>

                      <td className="py-4 px-6">{getStatusBadge(apt.status)}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {normStatus !== 'COMPLETED' && normStatus !== 'CANCELLED' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                                disabled={updatingStatus === apt._id}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Mark Completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                disabled={updatingStatus === apt._id}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Cancel Appointment"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="View Info"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setAppointmentToDelete(apt)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Limit Selector & Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200">
            <div className="p-4 flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <span>Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries per page</span>
            </div>

            <div className="w-full sm:w-auto">
              <Pagination
                currentPage={pagination.currentPage || page}
                totalPages={pagination.totalPages || 1}
                onPageChange={(newPage) => setPage(newPage)}
                hasPrevPage={pagination.hasPrevPage}
                hasNextPage={pagination.hasNextPage}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENT DETAILS MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div data-aos="zoom-in" data-aos-duration="200" className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 sm:p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Appointment Details</h3>
                <p className="text-[11px] text-slate-400 break-all">ID: {selectedAppointment._id}</p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 shrink-0">Patient Name:</span>
                  <span className="font-semibold text-slate-800 text-right truncate">
                    {selectedAppointment.patient?.name || selectedAppointment.userData?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 shrink-0">Patient Contact:</span>
                  <span className="font-semibold text-slate-800 text-right truncate">
                    {selectedAppointment.patient?.contactNumber || selectedAppointment.patient?.email || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 shrink-0">Doctor Name:</span>
                  <span className="font-semibold text-slate-800 text-right truncate">
                    {selectedAppointment.doctor?.name || selectedAppointment.docData?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 shrink-0">Specialization:</span>
                  <span className="font-semibold text-slate-800 text-right truncate">
                    {selectedAppointment.doctor?.specialization || selectedAppointment.doctor?.speciality || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 shrink-0">Date & Time:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {selectedAppointment.date || selectedAppointment.slotDate} at{' '}
                    {selectedAppointment.timeSlot || selectedAppointment.slotTime}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 shrink-0">Fee Amount:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    ${selectedAppointment.amount || selectedAppointment.doctor?.fees || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 shrink-0">Status:</span>
                  <div>{getStatusBadge(selectedAppointment.status)}</div>
                </div>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div data-aos="zoom-in" data-aos-duration="200" className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 sm:p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Delete Appointment?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this booking record? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAppointment}
                disabled={deleting}
                className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointment;