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

  // Helper function for status badge colors
  const getStatusBadgeStyle = (status = '') => {
    const lower = status.toLowerCase();
    if (lower === 'approved' || lower === 'confirmed') {
      return { backgroundColor: '#e6f4ea', color: '#137333' };
    }
    if (lower === 'cancelled' || lower === 'rejected') {
      return { backgroundColor: '#fce8e6', color: '#c5221f' };
    }
    // Default Pending
    return { backgroundColor: '#fef7e0', color: '#b06000' };
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a202c', marginBottom: '24px' }}>
        Appointments
      </h1>

      {loading && <p style={{ color: '#718096' }}>Loading appointments...</p>}
      {error && <p style={{ color: '#e53e3e', fontWeight: '500' }}>Error: {error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p style={{ color: '#718096' }}>No appointments found.</p>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {appointments.map((item) => {
            const badgeStyle = getStatusBadgeStyle(item.status);

            return (
              <div
                key={item._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Header: Reason & Status Badge */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#2d3748',
                      }}
                    >
                      {item.reason || 'General Consultation'}
                    </h3>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        textTransform: 'capitalize',
                        ...badgeStyle,
                      }}
                    >
                      {item.status || 'Pending'}
                    </span>
                  </div>

                  {/* Doctor Info Section */}
                  {item.doctor ? (
                    <div
                      style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px dashed #e2e8f0',
                      }}
                    >
                      <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#4a5568' }}>
                        <strong style={{ color: '#2d3748' }}>Doctor:</strong>{' '}
                        {item.doctor.name}
                      </p>
                      <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#4a5568' }}>
                        <strong style={{ color: '#2d3748' }}>Email:</strong>{' '}
                        {item.doctor.email}
                      </p>
                      {item.doctor.specialization && (
                        <p style={{ margin: '0', fontSize: '14px', color: '#4a5568' }}>
                          <strong style={{ color: '#2d3748' }}>Specialization:</strong>{' '}
                          {item.doctor.specialization}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px dashed #e2e8f0',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '14px', color: '#a0aec0' }}>
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