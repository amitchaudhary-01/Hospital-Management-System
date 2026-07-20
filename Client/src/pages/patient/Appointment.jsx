import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

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
      return 'bg-emerald-100 text-emerald-800';
    }
    if (lower === 'cancelled' || lower === 'rejected') {
      return 'bg-red-100 text-red-800';
    }
    // Default Pending
    return 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Appointments
      </h1>

      {loading && <p className="text-gray-500">Loading appointments...</p>}
      {error && <p className="text-red-600 font-medium">Error: {error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p className="text-gray-500">No appointments found.</p>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          {appointments.map((item) => {
            const badgeClass = getStatusBadgeClass(item.status);

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Header: Reason & Status Badge */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="m-0 text-lg font-semibold text-slate-700">
                      {item.reason || 'General Consultation'}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${badgeClass}`}
                    >
                      {item.status || 'Pending'}
                    </span>
                  </div>

                  {/* Doctor Info Section */}
                  {item.doctor ? (
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                      <p className="mb-1.5 text-sm text-slate-600">
                        <strong className="text-slate-800">Doctor:</strong>{' '}
                        {item.doctor.name}
                      </p>
                      <p className="mb-1.5 text-sm text-slate-600">
                        <strong className="text-slate-800">Email:</strong>{' '}
                        {item.doctor.email}
                      </p>
                      {item.doctor.specialization && (
                        <p className="m-0 text-sm text-slate-600">
                          <strong className="text-slate-800">Specialization:</strong>{' '}
                          {item.doctor.specialization}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                      <p className="m-0 text-sm text-slate-400">
                        No doctor assigned yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Appointment;