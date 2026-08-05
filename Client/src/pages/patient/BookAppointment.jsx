import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  // Form states
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || '');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');

  // UI feedback states
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch available doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await API.get('/patient/doctors');

        if (response.data?.doctors) {
          setDoctors(response.data.doctors);
        } else if (Array.isArray(response.data)) {
          setDoctors(response.data);
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
        setError('Could not load doctors list. Please refresh the page.');
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedDoctor || !date || !timeSlot) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        doctor: selectedDoctor,
        date,
        timeSlot,
        reason,
      };

      const response = await API.post('/appointments', payload);

      if (response.data?.success) {
        setSuccessMsg('Appointment booked successfully!');
        setTimeout(() => {
          navigate('/patient/appointments');
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to book appointment. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div data-aos="fade-up" className="bg-white rounded-xl border border-slate-200 shadow-md p-7">
        <h2 data-aos="fade-down" className="text-2xl font-semibold text-slate-800 mb-5">
          Book an Appointment
        </h2>

        {/* Feedback Messages */}
        {error && (
          <div data-aos="fade-in" className="p-3 bg-red-100 text-red-700 rounded-md mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div data-aos="fade-in" className="p-3 bg-emerald-100 text-emerald-800 rounded-md mb-4 text-sm font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Doctor */}
          <div>
            <label className="block mb-1.5 font-medium text-slate-700 text-sm">
              Select Doctor *
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              disabled={loadingDoctors || submitting}
              required
              className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed transition"
            >
              <option value="">
                {loadingDoctors ? 'Loading doctors...' : '-- Choose a Doctor --'}
              </option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} {doc.specialization ? `(${doc.specialization})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block mb-1.5 font-medium text-slate-700 text-sm">
              Date *
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              disabled={submitting}
              required
              className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 disabled:bg-slate-100 disabled:cursor-not-allowed transition"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block mb-1.5 font-medium text-slate-700 text-sm">
              Time Slot *
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              disabled={submitting}
              required
              className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed transition"
            >
              <option value="">-- Choose a Time Slot --</option>
              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
            </select>
          </div>

          {/* Reason / Concern */}
          <div>
            <label className="block mb-1.5 font-medium text-slate-700 text-sm">
              Reason for Visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitting}
              placeholder="e.g. Fever, Routine checkup, Chest pain"
              rows={3}
              className="w-full px-3 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 resize-y disabled:bg-slate-100 disabled:cursor-not-allowed transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;