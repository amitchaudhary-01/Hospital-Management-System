import React, { useState } from 'react';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    if (status) setStatus(null); // Clear alert when typing
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Points to environment variable or falls back to deployed Render server
  const backendUrl =
  import.meta.env.VITE_API_URL || 'https://hospital-management-server-pq65.onrender.com/api/v1';

try {
  const response = await fetch(`${backendUrl}/send-inquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  // Safely parse JSON or handle unexpected HTML responses
  const contentType = response.headers.get('content-type');
  let result = {};
  if (contentType && contentType.includes('application/json')) {
    result = await response.json();
  }

  if (response.ok && (result.success ?? true)) {
    setStatus({
      type: 'success',
      message: 'Your inquiry has been sent! Our team will contact you shortly.',
    });
    setFormData({ from_name: '', from_email: '', subject: '', message: '' });
  } else {
    throw new Error(result.error || result.message || `Server error (${response.status})`);
  }
} catch (error) {
  console.error('Submission Error:', error);
  setStatus({
    type: 'error',
    message: error.message || 'Failed to send inquiry. Please try again.',
  });
} finally {
  setLoading(false);
}
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-5 border border-slate-100">
        
        {/* Left Side: Info Panel */}
        <div className="md:col-span-2 bg-gradient-to-br from-teal-600 to-emerald-700 p-8 sm:p-10 text-white flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-teal-500/30 text-teal-100 text-xs font-semibold uppercase tracking-wider rounded-full backdrop-blur-sm border border-teal-400/20 mb-4">
              Hospital Help Center
            </span>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">
              Contact Patient Care
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed mb-8">
              Have questions about appointments, hospital services, or general inquiries? Fill out the form or reach us directly.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">📞</div>
                <div>
                  <strong className="block text-sm font-semibold text-white">Emergency / Helpline</strong>
                  <p className="text-teal-100 text-sm mt-0.5">+977 (9821005569)</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">📍</div>
                <div>
                  <strong className="block text-sm font-semibold text-white">Location</strong>
                  <p className="text-teal-100 text-sm mt-0.5">Rupandehi, Butwal, Nepal</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">⏰</div>
                <div>
                  <strong className="block text-sm font-semibold text-white">Working Hours</strong>
                  <p className="text-teal-100 text-sm mt-0.5">Mon - Sun: 24/7 Service Available</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-teal-500/30 text-xs text-teal-200">
            For life-threatening medical emergencies, please call 100, 101, 102 immediately.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-3 p-8 sm:p-10 bg-white">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Send an Inquiry</h3>

          {status && (
            <div className={`p-4 rounded-xl mb-6 flex items-start space-x-3 text-sm font-medium ${
              status.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              <span className="text-base leading-none">{status.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={sendEmail} className="space-y-5">
            <div>
              <label htmlFor="from_name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                value={formData.from_name}
                onChange={handleChange}
                placeholder="e.g. Amit Chaudhary"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-slate-800 placeholder-slate-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="from_email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="from_email"
                name="from_email"
                value={formData.from_email}
                onChange={handleChange}
                placeholder="e.g. ac984939@gmail.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-slate-800 placeholder-slate-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Department / Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Cardiology, General Inquiry"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-slate-800 placeholder-slate-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Message / Inquiry <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="How can we help you today?"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-slate-800 placeholder-slate-400 text-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Inquiry</span>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;