import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lampOn, setLampOn] = useState(false); // Controls the light and form visibility
  const [showPassword, setShowPassword] = useState(false);

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
        if (res.user.role === "admin") navigate("/admin/dashboard");
        else if (res.user.role === "doctor") navigate("/doctor/dashboard");
        else navigate("/patient/home");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-100 flex items-center justify-center overflow-hidden font-sans select-none">
      
      {/* Background Animated Blobs for Depth */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-sky-300 opacity-30 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[120px] pointer-events-none animate-pulse"></div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden m-4 min-h-[550px]">
        
        {/* LEFT PANEL: Interactive Lamp Interaction */}
        <div className="md:col-span-5 relative bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-blue-500/20 overflow-hidden">
          
          {/* Hanging Lamp Setup */}
          <div className="absolute top-0 flex flex-col items-center z-20">
            {/* Cord */}
            <div className="w-[3px] h-32 bg-gradient-to-b from-blue-300 to-blue-100/70"></div>
            {/* Lamp Shade */}
            <div className="w-24 h-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 rounded-t-full relative shadow-md">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-slate-950 rounded-full"></div>
            </div>
          </div>

          {/* Interactive Pull String Switch */}
          <button 
            onClick={() => setLampOn(!lampOn)}
            className="absolute top-1 left-[calc(50%+40px)] flex flex-col items-center group focus:outline-none z-30 transition-transform active:translate-y-2 cursor-pointer"
            title="Pull to toggle light"
          >
            <div className="w-[3px] h-58 bg-blue-200 group-hover:bg-sky-300 transition-colors"></div>
            <div className="w-4 h-4 rounded-full bg-amber-400 group-hover:bg-sky-300 border-2 border-indigo-900 shadow-md"></div>
          </button>

          {/* Dynamic Light Cone Effect */}
          <div 
            className={`absolute top-[170px] w-[350px] h-[400px] origin-top transition-all duration-700 ease-out pointer-events-none z-10 ${
              lampOn 
                ? "opacity-100 scale-100 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]" 
                : "opacity-0 scale-95"
            }`}
            style={{
              clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
              background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 70%, transparent 100%)"
            }}
          ></div>

          {/* Cute Robot Mascot Character */}
          <div className="relative z-20 mt-28 flex flex-col items-center text-center">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 bg-indigo-950/80 backdrop-blur-md ${
              lampOn ? "border-sky-300 shadow-[0_0_25px_rgba(125,211,252,0.6)]" : "border-indigo-400/30"
            }`}>
              {/* Simple CSS Smart Mascot Face */}
              <div className="w-20 h-14 flex flex-col justify-between">
                <div className="flex justify-around px-2">
                  <div className={`w-4 h-4 rounded-full transition-colors duration-500 ${lampOn ? "bg-sky-300 animate-pulse" : "bg-indigo-300/40"}`}></div>
                  <div className={`w-4 h-4 rounded-full transition-colors duration-500 ${lampOn ? "bg-sky-300 animate-pulse" : "bg-indigo-300/40"}`}></div>
                </div>
                <div className={`w-10 h-3 mx-auto rounded-b-full transition-all duration-500 ${lampOn ? "bg-sky-300 h-4" : "bg-indigo-300/40"}`}></div>
              </div>
            </div>
            <p className={`mt-6 font-medium text-sm transition-colors ${lampOn ? "text-sky-200" : "text-blue-200/60"}`}>
              {lampOn ? "Path Illuminated!" : "Pull the cord to illuminate your path"}
            </p>
          </div>

        </div>

        {/* RIGHT PANEL: The Login Form */}
        <div className="md:col-span-7 flex flex-col justify-center p-8 md:p-12 relative bg-white">
          
          {/* Conditional UI Overlay when Light is Off */}
          <div className={`absolute inset-0 bg-slate-50/60 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center z-20 pointer-events-none ${
            lampOn ? "opacity-0" : "opacity-100"
          }`}>
            <span className="text-slate-400 font-bold text-xl tracking-wider uppercase select-none">
              System Offline
            </span>
          </div>

          {/* Interactive Form Content wrapper */}
          <div className={`transition-all duration-700 ease-in-out ${
            lampOn ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-5 translate-y-4 pointer-events-none"
          }`}>
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 tracking-wide">
                Welcome <span className="text-blue-600">Back.</span>
              </h2>
              <p className="text-slate-500 text-xs mt-1">Hospital Management System Login</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Email Input Field */}
              <div>
                <label className="block text-xs font-semibold text-blue-700 tracking-widest uppercase mb-2">
                  Username / Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    tabIndex={lampOn ? 0 : -1}
                    className={`w-full bg-slate-50 text-slate-800 pl-4 pr-4 py-3 rounded-xl border outline-none transition-all duration-300 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-600 focus:bg-white"
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
                  <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input Field */}
              <div>
                <label className="block text-xs font-semibold text-blue-700 tracking-widest uppercase mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    tabIndex={lampOn ? 0 : -1}
                    className={`w-full bg-slate-50 text-slate-800 pl-4 pr-12 py-3 rounded-xl border outline-none transition-all duration-300 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-600 focus:bg-white"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />

                  {/* Eye Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    tabIndex={lampOn ? 0 : -1}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Sign In Button */}
              <button
                disabled={isSubmitting || !lampOn}
                tabIndex={lampOn ? 0 : -1}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.4)] transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none tracking-wider uppercase text-xs cursor-pointer"
              >
                {isSubmitting ? "Logging In..." : "Login →"}
              </button>
            </form>

            {/* Form Divider decoration */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs tracking-wider uppercase">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Social Authentication buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" tabIndex={lampOn ? 0 : -1} className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm hover:border-blue-600 hover:bg-white transition cursor-pointer">
                <Link to="www.google.com">Google</Link>
              </button>
              <button type="button" tabIndex={lampOn ? 0 : -1} className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm hover:border-blue-600 hover:bg-white transition cursor-pointer">
                <Link>GitHub</Link>
              </button>
            </div>

            {/* Bottom Form Navigation links */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-xs">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  tabIndex={lampOn ? 0 : -1}
                  className="text-blue-600 font-semibold hover:underline decoration-blue-600/40"
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