import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Search, CalendarDays } from 'lucide-react';

const PatientHome = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/patient/doctors", {
          withCredentials: true,
        });

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

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-8 md:p-10 shadow-lg shadow-sky-600/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-100 border border-white/20">
            Healthcare Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Welcome back to your health hub
          </h1>
          <p className="text-sky-100 text-sm leading-relaxed">
            Manage consultations, search specialist directories, and monitor your appointments easily.
          </p>
        </div>
        {/* Subtle Decorative Pattern */}
        <div className="absolute right-[-40px] bottom-[-40px] w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div
          onClick={() => navigate("/patient/appointments")}
          className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex items-start gap-5"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 text-xl font-bold group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
            <CalendarDays />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              My Appointments
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Check scheduled visits, review updates, or cancel active bookings.
            </p>
            <span className="text-xs text-sky-600 font-bold inline-flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
              View Schedule →
            </span>
          </div>
        </div>

        <div
          onClick={() => {
            const element = document.getElementById("explore-doctors");
            element?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex items-start gap-5"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
            <Search />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Find a Specialist
              </h3>
              {/* Doctor count badge on card */}
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {loading ? "..." : `${doctors.length} Available`}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Explore our directory of verified practitioners and lock in your slot.
            </p>
            <span className="text-xs text-emerald-600 font-bold inline-flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
              Browse Doctors ↓
            </span>
          </div>
        </div>
      </div>

      {/* Doctor Directory Section */}
      <section id="explore-doctors" className="space-y-6 pt-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Available Medical Specialists
              </h2>
              {/* Doctor count badge next to section heading */}
              <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                {loading ? "..." : `${filteredDoctors.length} ${filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'}`}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              {searchQuery
                ? `Showing ${filteredDoctors.length} of ${doctors.length} available doctors`
                : "Select a practitioner to schedule a consultation."}
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition shadow-xs"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <p className="text-sm font-semibold text-slate-700">No doctors found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or clear the search field.</p>
          </div>
        )}

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skeleton Loaders */}
          {loading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs animate-pulse flex flex-col justify-between h-56"
              >
                <div>
                  <div className="w-24 h-5 bg-slate-200 rounded-full" />
                  <div className="w-3/4 h-5 bg-slate-200 rounded-md mt-4" />
                  <div className="w-1/2 h-3 bg-slate-200 rounded-md mt-2" />
                </div>
                <div className="w-full h-9 bg-slate-200 rounded-xl" />
              </div>
            ))}

          {/* Rendered Doctor Cards */}
          {!loading &&
            !error &&
            filteredDoctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                      {doc.specialization || "General Medicine"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {doc.name}
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">{doc.email}</p>
                  </div>

                  {doc.address && (
                    <p className="text-slate-500 text-xs flex items-center gap-1.5 pt-1 border-t border-slate-100">
                      <span>📍</span> <span className="truncate">{doc.address}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/patient/book/${doc._id}`)}
                  className="w-full mt-6 bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200 tracking-wider uppercase cursor-pointer shadow-xs"
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