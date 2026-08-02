import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios'; 
import Loader from '../components/common/Loader'; // Import your loader component
import { 
  UserCheck, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Users,
  Activity,
  Stethoscope
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({
    doctorsCount: 0,
    patientsCount: 0,
    appointmentsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        const [doctorsRes, statsRes] = await Promise.allSettled([
          API.get('/admin/doctors'),
          API.get('/admin/dashboard-stats')
        ]);

        if (doctorsRes.status === 'fulfilled' && doctorsRes.value.data?.doctors) {
          setDoctors(doctorsRes.value.data.doctors);
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.data?.stats) {
          setStats(statsRes.value.data.stats);
        }
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  // Display the separate Loader component while data is loading
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Injecting local keyframes for marquee animation */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-custom {
          animation: marqueeScroll 20s linear infinite;
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-slate-100 rounded-3xl p-8 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-6 z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Empowering Lives Through Health 💊
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Navigating Health Together: Your Trusted Medical Resource and All-in-One Management System.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 group cursor-pointer"
              >
                Get started now
                <span className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-md h-64 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-center p-6 text-center">
              <div className="space-y-3">
                <Stethoscope className="w-16 h-16 text-sky-500 mx-auto" />
                <h3 className="font-bold text-slate-800">Healthcare Simplified</h3>
                <p className="text-xs text-slate-500">Book appointments, manage records, and connect with expert doctors effortlessly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS & PROOF SECTION ================= */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="flex flex-col justify-between space-y-4 pr-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                Your Bridge to Better Health <br />
                <span className="underline decoration-sky-400 underline-offset-4">
                  Start Your Journey Today
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/process')}
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-900 px-4 py-2.5 rounded-full cursor-pointer hover:bg-slate-800"
              >
                Our working process
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-xs text-slate-400">Medicine Meets Technology - Your Online Health Hub</p>
            </div>
          </div>

          <div className="bg-slate-100 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Our Clients</span>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold">A</div>
                <div className="w-7 h-7 rounded-full bg-sky-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-sky-700">B</div>
                <div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-amber-700">C</div>
              </div>
            </div>

            <div className="my-6">
              <h3 className="text-3xl font-extrabold text-slate-900">
                {stats.patientsCount > 0 ? `${stats.patientsCount}+` : '12K+'}
              </h3>
              <p className="text-xs text-slate-500">Happy clients & registered patients</p>
            </div>

            <Link to="/register" className="text-xs font-bold text-slate-800 flex items-center gap-1 hover:underline">
              View testimonial <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24 rounded-full border-4 border-sky-400 border-t-slate-200 flex items-center justify-center mb-4">
              <span className="text-xl font-extrabold text-slate-900">88%</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">Healing Success</h4>
            <p className="text-xs text-slate-400 mt-1">Verified patient satisfaction and recoveries</p>
          </div>
        </div>
      </section>

      {/* ================= BRAND BANNER ================= */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-[#D8EE5B] rounded-2xl py-6 overflow-hidden relative flex whitespace-nowrap">
          <div className="flex min-w-full animate-marquee-custom items-center justify-around gap-16 text-slate-900 font-bold text-lg px-8 shrink-0">
            <span className="opacity-80 hover:opacity-100 transition-opacity">omada</span>
            <span className="opacity-80 hover:opacity-100 transition-opacity">Robinhood</span>
            <span className="opacity-80 hover:opacity-100 transition-opacity">samsara</span>
            <span className="opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1">Firstbase</span>
            <span className="opacity-80 hover:opacity-100 transition-opacity">EXODUS</span>
          </div>
          <div className="flex min-w-full animate-marquee-custom items-center justify-around gap-16 text-slate-900 font-bold text-lg px-8 shrink-0" aria-hidden="true">
            <span className="opacity-80 hover:opacity-100 transition-opacity">omada</span>
            <span className="opacity-80 hover:opacity-100 transition-opacity">Robinhood</span>
            <span className="opacity-80 hover:opacity-100 transition-opacity">samsara</span>
            <span className="opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1">Firstbase</span>
            <span className="opacity-80 hover:opacity-100 transition-opacity">EXODUS</span>
          </div>
        </div>
      </section>

      {/* ================= 4 STEPS SECTION ================= */}
      <section id="process" className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">4 Easy Steps And Get Your Solution</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          Navigating Health Together: Your Trusted Medical Resource. Medicine Meets Technology Your Online Health Hub.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-left hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Check Doctor Profile</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse through our verified team of specialized doctors and read ratings.
            </p>
          </div>

          <div className="bg-sky-500 text-white p-6 rounded-2xl shadow-lg text-left">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold mb-2">Request Consultation</h3>
            <p className="text-xs text-sky-100 leading-relaxed">
              Select your preferred time slot and submit your medical inquiry.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-left hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Schedule Meeting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get automated booking confirmation and reminders for your virtual or in-person visit.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-left hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Get Your Solution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive digital prescriptions, tailored medical advice, and follow-up care.
            </p>
          </div>
        </div>
      </section>

      {/* ================= MEET OUR DOCTORS ================= */}
      <section id="doctors" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Meet Our Doctors</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              We're Dedicated To Your Well-Being
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.length > 0 ? (
            doctors.map((doc) => (
              <div 
                key={doc._id} 
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all text-center group cursor-pointer"
                onClick={() => navigate('/auth/login')}
              >
                <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                  {doc.image ? (
                    <img 
                      src={doc.image} 
                      alt={doc.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
                      {doc.name ? doc.name.charAt(0) : 'D'}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{doc.name || 'Jannatul Ferdous'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{doc.specialization || doc.speciality || 'Physiotherapist'}</p>
                {doc.fees && (
                  <p className="text-xs font-semibold text-sky-600 mt-2">${doc.fees} Consultation Fee</p>
                )}
              </div>
            ))
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                <div className="w-full h-44 bg-slate-100 rounded-xl mb-3 flex items-center justify-center">
                  <span className="text-xs text-slate-400">Doctor Photo</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Jannatul Ferdous</h3>
                <p className="text-xs text-slate-400 mt-0.5">Physiotherapist</p>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
};

export default LandingPage;