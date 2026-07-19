import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lampOn, setLampOn] = useState(false); // Controls the light and form visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password);
      toast.success(res.message);

      setTimeout(() => {
        if (res.user.role === "admin") navigate("/admin");
        else if (res.user.role === "doctor") navigate("/doctor");
        else navigate("/patient/home");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#081215] flex items-center justify-center overflow-hidden font-sans select-none">
      
      {/* Background Animated Blobs for Depth */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-[#00ffc3] opacity-10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#00c3a0] opacity-5 blur-[100px] pointer-events-none"></div>

      {/* Main Glassmorphic Container Card */}
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 bg-[#111e22]/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden m-4 min-h-[550px]">
        
        {/* LEFT PANEL: Interactive Lamp Interaction */}
        <div className="md:col-span-5 relative bg-[#0d171a] flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
          
          {/* Hanging Lamp Setup */}
          <div className="absolute top-0 flex flex-col items-center z-20">
            {/* Cord */}
            <div className="w-[3px] h-32 bg-gradient-to-b from-gray-700 to-gray-400"></div>
            {/* Lamp Shade */}
            <div className="w-24 h-12 bg-gradient-to-r from-gray-600 via-gray-800 to-gray-600 rounded-t-full relative shadow-md">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-gray-900 rounded-full"></div>
            </div>
          </div>

          {/* Interactive Pull String Switch */}
          <button 
            onClick={() => setLampOn(!lampOn)}
            className="absolute top-32 left-[calc(50%+40px)] flex flex-col items-center group focus:outline-none z-30 transition-transform active:translate-y-2 cursor-pointer"
            title="Pull to toggle light"
          >
            <div className="w-[2px] h-24 bg-gray-400 group-hover:bg-cyan-400 transition-colors"></div>
            <div className="w-4 h-4 rounded-full bg-amber-500 group-hover:bg-cyan-400 border-2 border-slate-900 shadow-md"></div>
          </button>

          {/* Dynamic Light Cone Effect */}
          <div 
            className={`absolute top-[170px] w-[350px] h-[400px] origin-top transition-all duration-700 ease-out pointer-events-none z-10 ${
              lampOn 
                ? "opacity-100 scale-100 filter drop-shadow-[0_0_30px_rgba(0,255,195,0.3)]" 
                : "opacity-0 scale-95"
            }`}
            style={{
              clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
              background: "linear-gradient(to bottom, rgba(0, 255, 195, 0.4) 0%, rgba(0, 255, 195, 0.03) 70%, transparent 100%)"
            }}
          ></div>

          {/* Cute Robot Mascot Character */}
          <div className="relative z-20 mt-28 flex flex-col items-center text-center">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 bg-[#111e22] ${
              lampOn ? "border-[#00ffc3] shadow-[0_0_25px_rgba(0,255,195,0.4)]" : "border-gray-700"
            }`}>
              {/* Simple CSS Smart Mascot Face */}
              <div className="w-20 h-14 flex flex-col justify-between">
                <div className="flex justify-around px-2">
                  <div className={`w-4 h-4 rounded-full transition-colors duration-500 ${lampOn ? "bg-[#00ffc3] animate-pulse" : "bg-gray-600"}`}></div>
                  <div className={`w-4 h-4 rounded-full transition-colors duration-500 ${lampOn ? "bg-[#00ffc3] animate-pulse" : "bg-gray-600"}`}></div>
                </div>
                <div className={`w-10 h-3 mx-auto rounded-b-full transition-all duration-500 ${lampOn ? "bg-[#00ffc3] h-4" : "bg-gray-600"}`}></div>
              </div>
            </div>
            <p className={`mt-6 font-medium text-sm transition-colors ${lampOn ? "text-[#00ffc3]" : "text-gray-500"}`}>
              {lampOn ? "Path Illuminated!" : "Pull the cord to illuminate your path"}
            </p>
          </div>

        </div>

        {/* RIGHT PANEL: The Login Form */}
        <div className="md:col-span-7 flex flex-col justify-center p-8 md:p-12 relative">
          
          {/* Conditional UI Overlay when Light is Off */}
          <div className={`absolute inset-0 bg-[#111e22]/10 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center z-20 pointer-events-none ${
            lampOn ? "opacity-0" : "opacity-100"
          }`}>
            <span className="text-gray-500/40 font-bold text-xl tracking-wider uppercase select-none">
              System Offline
            </span>
          </div>

          {/* Interactive Form Content wrapper */}
          <div className={`transition-all duration-700 ease-in-out ${
            lampOn ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-5 translate-y-4 pointer-events-none"
          }`}>
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white tracking-wide">
                Welcome <span className="text-[#00ffc3]">Back.</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Hospital Management System Login</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Email Input Field */}
              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-2">
                  Username / Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    tabIndex={lampOn ? 0 : -1}
                    className={`w-full bg-[#0d171a]/80 text-white pl-4 pr-4 py-3 rounded-xl border outline-none transition-all duration-300 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-800 focus:border-[#00ffc3] focus:shadow-[0_0_10px_rgba(0,255,195,0.15)]"
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input Field */}
              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  tabIndex={lampOn ? 0 : -1}
                  className={`w-full bg-[#0d171a]/80 text-white px-4 py-3 rounded-xl border outline-none transition-all duration-300 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-800 focus:border-[#00ffc3] focus:shadow-[0_0_10px_rgba(0,255,195,0.15)]"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Sign In Button */}
              <button
                disabled={isSubmitting || !lampOn}
                tabIndex={lampOn ? 0 : -1}
                className="w-full mt-2 bg-gradient-to-r from-[#00c3a0] to-[#00ffc3] text-gray-900 font-bold py-3 px-4 rounded-xl shadow-[0_4px_20px_rgba(0,255,195,0.25)] hover:shadow-[0_4px_25px_rgba(0,255,195,0.4)] transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none tracking-wider uppercase text-sm"
              >
                {isSubmitting ? "Logging In..." : "Login →"}
              </button>
            </form>

            {/* Form Divider decoration */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-xs tracking-wider uppercase">or</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            {/* Social Authentication buttons matches image layout */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" tabIndex={lampOn ? 0 : -1} className="flex items-center justify-center gap-2 bg-[#0d171a] border border-gray-800 text-gray-300 py-2.5 rounded-xl text-sm hover:border-gray-700 transition">
                <span>Google</span>
              </button>
              <button type="button" tabIndex={lampOn ? 0 : -1} className="flex items-center justify-center gap-2 bg-[#0d171a] border border-gray-800 text-gray-300 py-2.5 rounded-xl text-sm hover:border-gray-700 transition">
                <span>GitHub</span>
              </button>
            </div>

            {/* Bottom Form Navigation links */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-xs">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  tabIndex={lampOn ? 0 : -1}
                  className="text-[#00ffc3] font-semibold hover:underline decoration-[#00ffc3]/40"
                >
                  Create account
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;