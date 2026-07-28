import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Mail, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Phone, 
  Calendar,
  X,
  Pencil,
  Trash2,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Modal States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize React Hook Form for Edit Modal
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      contactNumber: '',
      age: '',
    },
  });

  // Fetch Patients List
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/admin/patients');

      if (response.data?.patients) {
        setPatients(response.data.patients);
      } else if (Array.isArray(response.data)) {
        setPatients(response.data);
      } else {
        setError('Invalid data format received from the server.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch patients list.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle Search Input Change (Reset to Page 1)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Modal Controllers
  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    reset({
      name: patient.name || '',
      email: patient.email || '',
      contactNumber: patient.contactNumber || patient.phone || '',
      age: patient.age || '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPatient(null);
    clearErrors();
    reset();
  };

 // Submit Patient Edit Form
const onEditSubmit = async (formData) => {
  try {
    setSubmitting(true);

    const payload = {
      ...formData,
      age: formData.age ? Number(formData.age) : null,
    };

    await API.patch(`/admin/patient/${selectedPatient._id}`, payload);
    toast.success('Patient details updated successfully!');
    closeModal();
    fetchPatients();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update patient');
  } finally {
    setSubmitting(false);
  }
};

  // Delete Patient Record
  const handleDeletePatient = async () => {
    try {
      setSubmitting(true);
      await API.delete(`/admin/patient/${selectedPatient._id}`);
      toast.success('Patient record removed successfully');
      closeModal();
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete patient');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) => {
    const name = patient.name?.toLowerCase() || '';
    const email = patient.email?.toLowerCase() || '';
    const age = String(patient.age || '').toLowerCase();
    const contact = (patient.contactNumber || patient.phone || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    return name.includes(term) || email.includes(term) || contact.includes(term) || age.includes(term);
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600" />
            <span>All Patients</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View registered patients and their administrative details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <span className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
            Total: {filteredPatients.length}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading patients list...</p>
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
      {!loading && !error && filteredPatients.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No Patients Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm ? "No patient accounts match your query." : "There are no patients registered yet."}
          </p>
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && filteredPatients.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Patient Name</th>
                  <th className="py-3.5 px-6">Contact & Details</th>
                  <th className="py-3.5 px-6">Registered On</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {currentPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50/60 transition-colors duration-150">
                    {/* Patient Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs shrink-0">
                          {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-tight">
                            {patient.name || 'Anonymous Patient'}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            ID: {patient._id?.slice(-6) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email, Phone & Age */}
                    <td className="py-4 px-6">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{patient.email || 'N/A'}</span>
                        </div>
                        {(patient.contactNumber || patient.phone) && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{patient.contactNumber || patient.phone}</span>
                          </div>
                        )}
                        {patient.age && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{patient.age} yrs old</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                      {patient.createdAt ? (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(patient.createdAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Active Status */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active User
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(patient)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View Info
                        </button>
                        <button
                          onClick={() => openEditModal(patient)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Patient"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(patient)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{' '}
                <span className="font-semibold text-slate-700">
                  {Math.min(endIndex, filteredPatients.length)}
                </span>{' '}
                of <span className="font-semibold text-slate-700">{filteredPatients.length}</span> patients
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PATIENT DETAILS MODAL */}
      {isViewModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">
                  {selectedPatient.name ? selectedPatient.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{selectedPatient.name}</h3>
                  <p className="text-[11px] text-slate-400">Patient Record Details</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Address:</span>
                  <span className="font-semibold text-slate-700">{selectedPatient.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Number:</span>
                  <span className="font-semibold text-slate-700">
                    {selectedPatient.contactNumber || selectedPatient.phone || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Age:</span>
                  <span className="font-semibold text-slate-700">{selectedPatient.age ? `${selectedPatient.age} Years` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">User ID:</span>
                  <span className="font-semibold text-slate-700">{selectedPatient._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered On:</span>
                  <span className="font-semibold text-slate-700">
                    {selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PATIENT MODAL */}
      {isEditModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Edit Patient Details</h3>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Patient Name"
                  {...register('name', { required: 'Name is required' })}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white ${
                    errors.name ? 'border-rose-400' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  {...register('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white ${
                    errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 234 567 890"
                    {...register('contactNumber')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    {...register('age')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Delete Patient Account?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <span className="font-semibold text-slate-700">{selectedPatient.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePatient}
                disabled={submitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPatients;