import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Stethoscope, ClipboardPenLine } from 'lucide-react';

const HowItWork = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-gray-900 sm:text-5xl">
            How <span className="text-blue-600">HospitalCare</span> Works
          </h1>
          <p className="mt-4 text-l text-gray-600 max-w-2xl mx-auto">
            Your step-by-step guide to navigating healthcare services, booking expert doctors, and managing your medical records effortlessly.
          </p>
        </div>

        {/* Step-by-Step Workflow Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
              1
            </div>
            <div className="flex justify-center items-center mb-4 mt-2 text-blue-600">
              <UserPlus className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Create an Account</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Sign up securely on our platform to access your personalized health dashboard, track upcoming appointments, and keep your profile updated.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
              2
            </div>
            <div className="flex justify-center items-center mb-4 mt-2 text-green-600">
              <Stethoscope className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Connect with Doctors</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Browse our team of 45+ expert doctors, review specialties and availability, and book consultations with just a few clicks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
              3
            </div>
            <div className="flex justify-center items-center mb-4 mt-2 text-amber-600">
              <ClipboardPenLine className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Manage Your Care</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Keep track of your medical history, review health recommendations, and receive ongoing support from our dedicated 120+ nursing staff.
            </p>
          </div>
        </div>

        {/* Detailed Explanation / Features Section */}
        <div className="mt-16 bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seamless Healthcare at Your Fingertips</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our system is designed to remove the friction traditionally associated with hospital visits. Operating out of our facility in Butwal, Rupandehi, Nepal, we combine modern medical technology with a user-friendly digital interface to serve you efficiently from Sunday to Friday, 9am to 8pm.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/doctors" 
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Browse Doctors
              </Link>
              <Link 
                to="/contact" 
                className="bg-white text-blue-600 border border-blue-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWork;