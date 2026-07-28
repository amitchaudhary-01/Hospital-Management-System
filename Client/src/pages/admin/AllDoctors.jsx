import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Stethoscope, 
  Mail, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Award, 
  Phone, 
  Plus, 
  Pencil, 
  Trash2, 
  X
} from 'lucide-react';

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize React Hook Form
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
      password: '',
      specialization: '',
      experience: '',
      contactNumber: '',
    },
  });

  // Fetch Doctors List
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/admin/doctors');

      if (response.data?.doctors) {
        setDoctors(response.data.doctors);
      } else if (Array.isArray(response.data)) {
        setDoctors(response.data);
      } else {
        setError('Invalid data format received from the server.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch doctors list.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setSelectedDoctor(null);
    reset({
      name: '',
      email: '',
      password: '',
      specialization: '',
      experience: '',
      contactNumber: '',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    reset({
      name: doctor.name || '',
      email: doctor.email || '',
      password: '',
      specialization: doctor.specialization || '',
      experience: doctor.experience || '',
      contactNumber: doctor.contactNumber || '',
    });
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteModalOpen(true);
  };

  // Close Modals & Clear State
  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedDoctor(null);
    clearErrors();
    reset();
  };

  // Handle Form Submission (Add or Edit)
  const onSubmitForm = async (formData) => {
    try {
      setSubmitting(true);
      if (isAddModalOpen) {
        await API.post('/admin/doctor', formData);
        toast.success('Doctor added successfully!');
      } else if (isEditModalOpen && selectedDoctor) {
        const payload = { ...formData };
        if (!payload.password) {
          delete payload.password;
        }
        await API.put(`/admin/doctor/${selectedDoctor._id}`, payload);
        toast.success('Doctor details updated successfully!');
      }
      closeModal();
      fetchDoctors();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (isAddModalOpen ? 'Failed to add doctor' : 'Failed to update doctor')
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Doctor
  const handleDeleteDoctor = async () => {
    try {
      setSubmitting(true);
      await API.delete(`/admin/doctor/${selectedDoctor._id}`);
      toast.success('Doctor removed successfully');
      closeModal();
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete doctor');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter doctors based on search
  const filteredDoctors = doctors.filter((doc) => {
    const name = doc.name?.toLowerCase() || '';
    const spec = doc.specialization?.toLowerCase() || '';
    const email = doc.email?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();

    return name.includes(term) || spec.includes(term) || email.includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-6 py-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
            <span>All Doctors</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage and register healthcare professionals in the system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or spec..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Add Doctor Button */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading doctors list...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-4 sm:p-6 flex items-center gap-3 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredDoctors.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm sm:text-base font-semibold text-slate-700">No Doctors Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm ? "No doctors match your query." : "Click 'Add Doctor' to register a new doctor."}
          </p>
        </div>
      )}

      {/* Data Section */}
      {!loading && !error && filteredDoctors.length > 0 && (
        <>
          {/* MOBILE & TABLET VIEW: Card Grid (Visible below 'md' screen size) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc._id} 
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Doctor Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                        {doc.name ? doc.name.charAt(0).toUpperCase() : 'D'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {doc.name || 'Dr. Unknown'}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{doc.email || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                        Specialization
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-100 text-[11px]">
                        <Award className="w-3 h-3 text-blue-500 shrink-0" />
                        <span className="truncate">{doc.specialization || 'General'}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                        Experience
                      </span>
                      <span className="text-slate-700 font-medium">
                        {doc.experience ? `${doc.experience} Years` : '—'}
                      </span>
                    </div>

                    <div className="col-span-2 pt-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                        Contact
                      </span>
                      {doc.contactNumber ? (
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{doc.contactNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(doc)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200 hover:border-blue-200"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(doc)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200 hover:border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table (Visible on 'md' screens and up) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-6">Doctor Details</th>
                    <th className="py-3.5 px-6">Specialization</th>
                    <th className="py-3.5 px-6">Experience</th>
                    <th className="py-3.5 px-6">Contact</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/60 transition-colors duration-150">
                      {/* Doctor Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                            {doc.name ? doc.name.charAt(0).toUpperCase() : 'D'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">
                              {doc.name || 'Dr. Unknown'}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              <span>{doc.email || 'N/A'}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                          <Award className="w-3.5 h-3.5 text-blue-500" />
                          {doc.specialization || 'General Physician'}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                        {doc.experience ? `${doc.experience} Years` : '—'}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {doc.contactNumber ? (
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{doc.contactNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Edit / Delete Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(doc)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Doctor"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(doc)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Doctor"
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
          </div>
        </>
      )}

      {/* CREATE / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-4 sm:p-6 space-y-4 sm:space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {isAddModalOpen ? 'Register New Doctor' : 'Edit Doctor Details'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. John Doe"
                    {...register('name', { required: 'Full name is required' })}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white ${
                      errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@clinic.com"
                    {...register('email', { 
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white ${
                      errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password (Add Mode Only) */}
                {isAddModalOpen && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white ${
                        errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    {errors.password && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                )}

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="Cardiology"
                    {...register('specialization')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    {...register('experience')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+977 9800000000"
                    {...register('contactNumber')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 sm:pt-4 border-t border-slate-100">
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isAddModalOpen ? 'Create Doctor' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 sm:p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Delete Doctor Account?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <span className="font-semibold text-slate-700">{selectedDoctor.name}</span>? This action cannot be undone.
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
                onClick={handleDeleteDoctor}
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

export default AllDoctors;