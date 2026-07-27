import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
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
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Fetch Appointments List with Pagination
  const fetchAppointments = async (currentPage = page, currentLimit = limit) => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get(`/admin/appointments?page=${currentPage}&limit=${currentLimit}`);

      if (response.data?.success) {
        setAppointments(response.data.appointments || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else if (Array.isArray(response.data)) {
        // Fallback for non-paginated legacy response structure
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
  };

  useEffect(() => {
    fetchAppointments(page, limit);
  }, [page, limit]);

  // Update Appointment Status
  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingStatus(id);
      await API.put(`/admin/appointment/${id}/status`, { status });
      toast.success(`Appointment marked as ${status.toLowerCase()}`);
      
      // Update local state smoothly
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
      
      // Refresh current page after deletion
      fetchAppointments(page, limit);
      setAppointmentToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete appointment');
    } finally {
      setDeleting(false);
    }
  };

  // Client-side Filter Logic for active page records
  const filteredAppointments = appointments.filter((apt) => {
    const patientName = apt.patient?.name || apt.userData?.name || apt.patientName || '';
    const doctorName = apt.doctor?.name || apt.docData?.name || apt.doctorName || '';
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      patientName.toLowerCase().includes(term) ||
      doctorName.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'ALL' ||
      apt.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Dynamic Status Badge Helper
  const getStatusBadge = (status) => {
    const normStatus = (status || 'PENDING').toUpperCase();

    if (normStatus === 'CANCELLED') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Cancelled
        </span>
      );
    }
    if (normStatus === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>
      );
    }
    if (normStatus === 'CONFIRMED') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          Confirmed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Pending
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-sky-600" />
            <span>All Appointments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor and manage all doctor-patient bookings across the system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <span className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
            Total Records: {pagination.totalItems || filteredAppointments.length}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading appointments...</p>
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
      {!loading && !error && filteredAppointments.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Appointments Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No records match your selected filters.'
              : 'There are no appointments booked yet.'}
          </p>
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && filteredAppointments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
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
                {filteredAppointments.map((apt) => {
                  const patient = apt.patient || apt.userData || {};
                  const doctor = apt.doctor || apt.docData || {};

                  const patientName = patient.name || apt.patientName || 'Anonymous';
                  const doctorName = doctor.name || apt.doctorName || 'Unassigned Doctor';
                  const doctorSpec = doctor.specialization || doctor.speciality || 'General';

                  const dateDisplay = apt.date || apt.slotDate || 'N/A';
                  const timeDisplay = apt.timeSlot || apt.slotTime || 'N/A';

                  return (
                    <tr key={apt._id} className="hover:bg-slate-50/60 transition-colors duration-150">
                      {/* Patient Info */}
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

                      {/* Doctor Info */}
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

                      {/* Date & Time */}
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

                      {/* Fees */}
                      <td className="py-4 px-6 text-xs font-semibold text-slate-800">
                        ${apt.amount || doctor.fees || '0'}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">{getStatusBadge(apt.status)}</td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Complete / Cancel triggers */}
                          {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                                disabled={updatingStatus === apt._id}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Mark Completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                disabled={updatingStatus === apt._id}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

          {/* Pagination Controls Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50/50 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
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

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <div className="inline-flex items-center gap-1">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrevPage}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENT DETAILS MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Appointment Details</h3>
                <p className="text-[11px] text-slate-400">ID: {selectedAppointment._id}</p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Patient Name:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.patient?.name || selectedAppointment.userData?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Patient Contact:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.patient?.contactNumber || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Doctor Name:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.doctor?.name || selectedAppointment.docData?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Specialization:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.doctor?.specialization || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.date || selectedAppointment.slotDate} at{' '}
                    {selectedAppointment.timeSlot || selectedAppointment.slotTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Fee Amount:</span>
                  <span className="font-semibold text-slate-800">
                    ${selectedAppointment.amount || selectedAppointment.doctor?.fees || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status:</span>
                  <div>{getStatusBadge(selectedAppointment.status)}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Delete Appointment?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this booking record? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAppointment}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
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