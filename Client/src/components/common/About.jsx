import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            About <span className="text-blue-600">HospitalCare</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Navigating Health Together: Your Trusted Medical Resource and All-in-One Management System.
          </p>
        </div>

        {/* Content Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Description */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Empowering Lives Through Health</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              At HospitalCare, we strive to simplify healthcare accessibility for everyone. Whether you need to book appointments, manage medical records, or connect with expert doctors effortlessly, our platform ensures a seamless experience.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to bridge the gap between patients and medical professionals, delivering reliable care right when you need it.
            </p>
          </div>

          {/* Right Column: Highlight Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
            <div className="text-blue-600 text-5xl mb-4 flex justify-center">
              <Hospital />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Healthcare Simplified</h3>
            <p className="text-gray-600 text-sm">
              Dedicated to offering top-notch support, secure data management, and trusted healthcare resources from Sunday to Friday (9am - 8pm).
            </p>
          </div>
        </div>

        {/* How the System Works Section */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How the System Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="text-blue-600 text-3xl font-bold mb-2">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create an Account</h3>
              <p className="text-gray-600 text-sm">Sign up easily to access your personal dashboard and manage appointments.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-blue-600 text-3xl font-bold mb-2">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Doctors</h3>
              <p className="text-gray-600 text-sm">Browse expert doctors, view specialties, and book appointments effortlessly.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-blue-600 text-3xl font-bold mb-2">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Care</h3>
              <p className="text-gray-600 text-sm">Track medical records, review health updates, and receive continuous support.</p>
            </div>
          </div>
        </div>

        {/* Hospital Infrastructure & Location Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Expert Doctors</h4>
            <p className="mt-2 text-3xl font-extrabold text-blue-600">45+</p>
            <p className="mt-1 text-xs text-gray-500">Specialized medical professionals</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nursing Staff</h4>
            <p className="mt-2 text-3xl font-extrabold text-blue-600">120+</p>
            <p className="mt-1 text-xs text-gray-500">Dedicated care providers</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hospital Beds</h4>
            <p className="mt-2 text-3xl font-extrabold text-blue-600">250</p>
            <p className="mt-1 text-xs text-gray-500">Equipped with modern facilities</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Advanced Equipment</h4>
            <p className="mt-2 text-3xl font-extrabold text-blue-600">500+</p>
            <p className="mt-1 text-xs text-gray-500">Diagnostic & surgical units</p>
          </div>
        </div>

        {/* Location & Map Section */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Location</h2>
              <p className="text-gray-600 flex items-center mb-1">
                📍 Butwal, Rupandehi, Nepal
              </p>
              <p className="text-gray-500 text-sm">
                Operating Hours: Sun - Fri : 9am - 8pm
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link 
                to="/contact" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
            <iframe
              title="Hospital Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456815344337!2d83.4731!3d27.7005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399686bc541f7151%3A0x6d5e0624d9c0258b!2sButwal%2C%20Nepal!5e0!3m2!1sen!2snp!4v1650000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;