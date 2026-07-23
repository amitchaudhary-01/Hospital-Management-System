import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Stethoscope, 
  Phone, 
  MapPin, 
  RefreshCw 
} from 'lucide-react';

const CreateDoctor = () => {
  const [loading, setLoading] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      specialization: '',
      contactNumber: '',
      address: '',
    },
  });

  // Submit Handler
  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const { data } = await API.post('/admin/register', formData);

      if (data.success) {
        toast.success(data.message || 'Doctor registered successfully.');
        reset(); // Clear all registered form fields
      } else {
        toast.error(data.message || 'Failed to register doctor.');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Error occurred while registering doctor.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <UserPlus className="w-6 h-6 text-sky-600" />
            <span>Register Doctor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Register a new doctor account with system credentials and clinic details.
          </p>
        </div>
      </div>

      {/* Form Body */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium text-slate-700">
          
          {/* Full Name */}
          <div>
            <label className="block mb-1.5 text-slate-600">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Dr. XXXXX"
                {...register('name', { required: 'Full name is required' })}
                className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:bg-white transition-all ${
                  errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1.5 text-slate-600">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="xxxxxx@clinic.com"
                {...register('email', { 
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:bg-white transition-all ${
                  errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5 text-slate-600">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="........."
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:bg-white transition-all ${
                  errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block mb-1.5 text-slate-600">Specialization</label>
            <div className="relative">
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cardiology, General Practice, etc."
                {...register('specialization', { required: 'Specialization is required' })}
                className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:bg-white transition-all ${
                  errors.specialization ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors.specialization && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.specialization.message}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block mb-1.5 text-slate-600">Contact Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+977 (xxxxxxxxxx)"
                {...register('contactNumber', { required: 'Contact number is required' })}
                className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:bg-white transition-all ${
                  errors.contactNumber ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors.contactNumber && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.contactNumber.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1.5 text-slate-600">Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rupandehi, Butwal, hospital line"
                {...register('address', { required: 'Address is required' })}
                className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:bg-white transition-all ${
                  errors.address ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors.address && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.address.message}</p>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Registering Doctor...</span>
              </>
            ) : (
              <span>Register Doctor</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateDoctor;