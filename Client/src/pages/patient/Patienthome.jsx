import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        
        // ⚠️ NOTE: Double check your exact backend URL port and route pattern!
        const response = await API.get("/patient/doctors", {
          withCredentials: true 
        });
        
        console.log("Backend Response payload:", response.data);

        // Safe extraction layer matching your backend controller:
        if (response.data && response.data.doctors) {
          setDoctors(response.data.doctors);
        } else if (Array.isArray(response.data)) {
          setDoctors(response.data);
        } else {
          setError("Data format received from server is invalid.");
        }
      } catch (err) {
        console.error("Error fetching doctors details:", err);
        setError(err.response?.data?.message || "Failed to establish connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="relative min-h-screen px-6 py-12 max-w-6xl mx-auto overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[#00ffc3]/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Welcome Hero Section */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Hello, Welcome <span className="text-[#00ffc3]">Back</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Manage your health profile, consult specialists, and coordinate your upcoming hospital appointments seamlessly.
        </p>
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Card 1: View Appointments */}
        <div 
          onClick={() => navigate("/patient/appointments")}
          className="bg-[#111e22]/40 border border-white/5 p-8 rounded-2xl hover:border-[#00ffc3]/30 hover:shadow-[0_0_20px_rgba(0,255,195,0.05)] transition-all duration-300 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#00ffc3]/10 flex items-center justify-center text-[#00ffc3] mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
            📅
          </div>
          <h3 className="text-xl font-bold mb-2">My Appointments</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Review your historical visits, check real-time status updates on active bookings, or cancel scheduled slots.
          </p>
          <span className="text-xs text-[#00ffc3] font-semibold inline-block mt-4 tracking-wider group-hover:translate-x-1 transition-transform">
            Open Dashboard →
          </span>
        </div>

        {/* Card 2: Explore Doctors */}
        <div 
          onClick={() => {
            const element = document.getElementById("explore-doctors");
            element?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-[#111e22]/40 border border-white/5 p-8 rounded-2xl hover:border-[#00ffc3]/30 hover:shadow-[0_0_20px_rgba(0,255,195,0.05)] transition-all duration-300 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#00c3a0]/10 flex items-center justify-center text-[#00c3a0] mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
            🔍
          </div>
          <h3 className="text-xl font-bold mb-2">Find a Specialist</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Browse through available institutional practitioners grouped comprehensively by clinical medical specializations.
          </p>
          <span className="text-xs text-[#00ffc3] font-semibold inline-block mt-4 tracking-wider group-hover:translate-x-1 transition-transform">
            Explore Doctors ↓
          </span>
        </div>
      </div>

      {/* EXPLORE DOCTORS DIRECTORY */}
      <section id="explore-doctors" className="pt-6 scroll-mt-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-wide">
            Our Medical <span className="text-[#00ffc3]">Specialists</span>
          </h2>
          <p className="text-gray-400 text-xs mt-1">Select a verified professional to lock in your preferred schedule slot.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-sm text-gray-400 animate-pulse bg-[#111e22]/20 border border-white/5 p-4 rounded-xl">
            ⚡ Fetching active medical staff from database...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Empty Database State */}
        {!loading && !error && doctors.length === 0 && (
          <div className="text-sm text-gray-400 bg-[#111e22]/20 border border-white/5 p-6 rounded-xl text-center">
            No doctors found in the system matching the criteria.
          </div>
        )}

        {/* Doctor Render Grid */}
        {!loading && !error && doctors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div 
                key={doc._id} 
                className="bg-[#0d171a] border border-gray-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[180px]"
              >
                <div>
                  <span className="bg-[#00ffc3]/10 text-[#00ffc3] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    {doc.specialization || "General Medicine"}
                  </span>
                  <h4 className="text-lg font-bold mt-4 text-white tracking-wide">{doc.name}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{doc.email}</p>
                  {doc.address && <p className="text-gray-600 text-[11px] mt-2">📍 {doc.address}</p>}
                </div>

                <button 
                  onClick={() => navigate(`/patient/book/${doc._id}`)}
                  className="w-full mt-6 bg-[#111e22] hover:bg-[#00ffc3] text-gray-300 hover:text-gray-950 border border-gray-800 hover:border-[#00ffc3] text-xs font-bold py-2 px-4 rounded-xl transition-all duration-300 tracking-wider uppercase cursor-pointer"
                >
                  Request Consultation
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PatientHome;