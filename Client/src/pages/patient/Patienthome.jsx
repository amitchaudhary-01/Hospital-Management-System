import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const PatientHome = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await API.get("/patient/doctors", {
          withCredentials: true 
        });
        
        console.log("Backend Response payload:", response.data);

        if (response.data && response.data.doctors) {
          setDoctors(response.data.doctors);
        } else if (Array.isArray(response.data)) {
          setDoctors(response.data);
        } else {
          setError("Data format received from server is invalid.");
        }
      } catch (err) {
        console.error("Error fetching doctors details:", err);
        setError(err.response?.data?.message || "Failed to establish connection to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 px-6 py-12 max-w-6xl mx-auto overflow-hidden text-slate-800">
      {/* Soft Bright Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-sky-200/60 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[200px] right-[-100px] w-96 h-96 bg-cyan-200/50 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Welcome Hero Section */}
      <div className="mb-12 text-center md:text-left relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          Patient Portal Active
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Hello, Welcome <span className="text-sky-600">Back</span>
        </h1>
        <p className="text-slate-600 mt-2 text-sm md:text-base max-w-2xl">
          Manage your health profile, consult specialists, and coordinate your upcoming hospital appointments seamlessly.
        </p>
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 relative z-10">
        {/* Card 1: View Appointments */}
        <div 
          onClick={() => navigate("/patient/appointments")}
          className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
            📅
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">My Appointments</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Review your historical visits, check real-time status updates on active bookings, or cancel scheduled slots.
          </p>
          <span className="text-xs text-sky-600 font-bold inline-block mt-4 tracking-wider group-hover:translate-x-1 transition-transform">
            Open Dashboard →
          </span>
        </div>

        {/* Card 2: Explore Doctors */}
        <div 
          onClick={() => {
            const element = document.getElementById("explore-doctors");
            element?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
            🔍
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">Find a Specialist</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Browse through available institutional practitioners grouped comprehensively by clinical medical specializations.
          </p>
          <span className="text-xs text-emerald-600 font-bold inline-block mt-4 tracking-wider group-hover:translate-x-1 transition-transform">
            Explore Doctors ↓
          </span>
        </div>
      </div>

      {/* EXPLORE DOCTORS DIRECTORY */}
      <section id="explore-doctors" className="pt-6 scroll-mt-24 relative z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Our Medical <span className="text-sky-600">Specialists</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1">Select a verified professional to lock in your preferred schedule slot.</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-2 mb-6">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Empty Database State */}
        {!loading && !error && doctors.length === 0 && (
          <div className="text-sm text-slate-500 bg-white border border-slate-200 p-8 rounded-xl text-center shadow-sm">
            No doctors found in the system matching the criteria.
          </div>
        )}

        {/* Doctor Render Grid & Skeleton Loading State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skeleton Loaders (Rendered while fetching data) */}
          {loading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm animate-pulse flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  {/* Badge Skeleton */}
                  <div className="w-24 h-5 bg-slate-200 rounded-full"></div>
                  {/* Doctor Name Skeleton */}
                  <div className="w-3/4 h-6 bg-slate-200 rounded-md mt-4"></div>
                  {/* Email Skeleton */}
                  <div className="w-1/2 h-3 bg-slate-200 rounded-md mt-2"></div>
                  {/* Address Skeleton */}
                  <div className="w-2/3 h-3 bg-slate-200 rounded-md mt-3"></div>
                </div>

                {/* Button Skeleton */}
                <div className="w-full h-9 bg-slate-200 rounded-xl mt-6"></div>
              </div>
            ))}

          {/* Actual Doctor Cards */}
          {!loading && !error && doctors.length > 0 &&
            doctors.map((doc) => (
              <div 
                key={doc._id} 
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full inline-block">
                    {doc.specialization || "General Medicine"}
                  </span>
                  <h4 className="text-lg font-bold mt-3 text-slate-900 tracking-tight">{doc.name}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{doc.email}</p>
                  {doc.address && <p className="text-slate-600 text-[11px] mt-2 flex items-center gap-1">📍 {doc.address}</p>}
                </div>

                <button 
                  onClick={() => navigate(`/patient/book/${doc._id}`)}
                  className="w-full mt-6 bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200 tracking-wider uppercase cursor-pointer"
                >
                  Request Consultation
                </button>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default PatientHome;