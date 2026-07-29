import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Replace with your EmailJS credentials
    emailjs
      .sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formRef.current,
        'YOUR_PUBLIC_KEY'
      )
      .then(
        (result) => {
          setLoading(false);
          setStatus({
            type: 'success',
            message: 'Thank you! Your message has been sent successfully.',
          });
          formRef.current.reset();
        },
        (error) => {
          setLoading(false);
          setStatus({
            type: 'error',
            message: 'Failed to send message. Please try again later.',
          });
          console.error(error);
        }
      );
  };

  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Info Box */}
        <div className="bg-blue-600 p-8 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-blue-100 text-sm mb-8 leading-relaxed">
              Have questions or need assistance? Reach out to us and our team will get back to you shortly.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <a href="mailto:HospitalCare@gmail.com" className="hover:underline">
                  HospitalCare@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <a href="tel:+9779821005569" className="hover:underline">
                  +977 9821005569
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <span>Butwal, Rupandehi, Nepal</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">⏰</span>
                <span>Sun - Fri : 9am - 8pm</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-500/50 text-xs text-blue-200">
            HospitalCare Support Team
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Send us a Message</h3>

          {status.message && (
            <div
              className={`p-3 text-sm rounded-lg mb-4 ${
                status.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {status.message}
            </div>
          )}

          <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="user_name"
                required
                placeholder="John Doe"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="user_email"
                required
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Appointment Inquiry"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Write your message here..."
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;