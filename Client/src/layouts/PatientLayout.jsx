import { Outlet, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Adjusted import path to match your structure

const PatientLayout = () => {
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#081215] text-white font-sans flex flex-col">
      {/* Universal Patient Navbar */}
      <nav className="bg-[#111e22]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link to="/patient/home" className="text-xl font-bold tracking-wide">
          Hospital <span className="text-[#00ffc3]">Care</span>
        </Link>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/patient/home" className="text-gray-300 hover:text-[#00ffc3] transition">Home</Link>
          <Link to="/patient/appointments" className="text-gray-300 hover:text-[#00ffc3] transition">My Appointments</Link>
          <button 
            onClick={handleLogout}
            className="border border-red-500/30 text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-500/10 transition text-xs uppercase font-bold tracking-wider cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dynamic Content Loader */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;