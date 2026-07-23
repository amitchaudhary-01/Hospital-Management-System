import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        contactNumber: data.contactNumber,
        gender: data.gender,
        age: Number(data.age), // 👈 Added age here
        BloodGroup: data.BloodGroup,
        address: data.address,
      });

      toast.success(res.message || "Registration Successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Signup error:", error);

      const serverMessage = error.response?.data?.message;
      const genericMessage = error.message;

      const finalErrorMessage =
        serverMessage ||
        genericMessage ||
        "An unexpected registration error occurred.";

      toast.error(finalErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08e9a2] flex items-center justify-center overflow-x-hidden py-10 px-4 font-sans select-none">
      {/* Background Ambience */}
      <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-[#00ffc3] opacity-5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#00c3a0] opacity-10 blur-[100px] pointer-events-none animate-pulse" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 bg-[#111e22]/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* LEFT PANEL */}
        <div className="md:col-span-5 relative bg-[#0d171a] flex flex-col justify-between p-10 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden min-h-[400px] md:min-h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-[#00ffc3]/10 rounded-full flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 border border-[#00ffc3]/20 rounded-full flex items-center justify-center animate-ping duration-[3000ms]" />
            <div className="absolute w-40 h-40 bg-gradient-to-br from-[#00c3a0]/10 to-transparent blur-xl rounded-full" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white tracking-wide leading-tight">
              Hospital <br />
              <span className="text-[#00ffc3]">Management</span>
            </h2>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-xs">
              Create your patient account to seamlessly book appointments,
              safely access health documentation, and communicate with
              specialist doctors.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/5 pt-6 mt-12">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">100+</h3>
                <p className="text-xs text-[#00ffc3] font-semibold uppercase tracking-wider mt-0.5">
                  Expert Doctors
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">24/7</h3>
                <p className="text-xs text-[#00ffc3] font-semibold uppercase tracking-wider mt-0.5">
                  Live Support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white tracking-wide">
              Create <span className="text-[#00ffc3]">Account</span>
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Register below to initiate your account setup
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full bg-[#0d171a]/80 text-white px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-300 ${
                    errors.name ? "border-red-500 focus:border-red-500" : "border-gray-800 focus:border-[#00ffc3]"
                  }`}
                  {...register("name", { required: "Full Name is required" })}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="***@example.com"
                  className={`w-full bg-[#0d171a]/80 text-white px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-300 ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-gray-800 focus:border-[#00ffc3]"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Password & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-1.5">
                  Secure Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-[#0d171a]/80 text-white px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-300 ${
                    errors.password ? "border-red-500 focus:border-red-500" : "border-gray-800 focus:border-[#00ffc3]"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Must span at least 6 characters",
                    },
                  })}
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-1.5">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="+977 00-00000000"
                  className="w-full bg-[#0d171a]/80 text-white px-4 py-2.5 rounded-xl border border-gray-800 focus:border-[#00ffc3] outline-none text-sm transition-all duration-300"
                  {...register("contactNumber")}
                />
              </div>
            </div>

            {/* Gender, Age & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-1.5">
                  Gender
                </label>
                <select
                  defaultValue=""
                  className={`w-full bg-[#0d171a]/80 text-white px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-300 ${
                    errors.gender ? "border-red-500 focus:border-red-500" : "border-gray-800 focus:border-[#00ffc3]"
                  }`}
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
              </div>

              {/* Age (NEW FIELD) */}
              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="e.g. XX"
                  className={`w-full bg-[#0d171a]/80 text-white px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-300 ${
                    errors.age ? "border-red-500 focus:border-red-500" : "border-gray-800 focus:border-[#00ffc3]"
                  }`}
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 0, message: "Age must be valid" },
                  })}
                />
                {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-1.5">
                  Blood Group
                </label>
                <select
                  defaultValue=""
                  className={`w-full bg-[#0d171a]/80 text-white px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-300 ${
                    errors.BloodGroup ? "border-red-500 focus:border-red-500" : "border-gray-800 focus:border-[#00ffc3]"
                  }`}
                  {...register("BloodGroup", { required: "Blood Group is required" })}
                >
                  <option value="" disabled>Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.BloodGroup && <p className="text-red-400 text-xs mt-1">{errors.BloodGroup.message}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-[#00ffc3] tracking-widest uppercase mb-1.5">
                Residential Address
              </label>
              <textarea
                rows="2"
                placeholder="Enter street details and city"
                className="w-full bg-[#0d171a]/80 text-white px-4 py-2.5 rounded-xl border border-gray-800 focus:border-[#00ffc3] outline-none text-sm transition-all duration-300 resize-none"
                {...register("address")}
              />
            </div>

            {/* Terms */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 accent-[#00ffc3]"
                  {...register("terms", {
                    required: "Accepting Terms & Conditions is mandatory",
                  })}
                />
                <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer select-none">
                  I formally acknowledge and consent to the system Terms & Conditions.
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-xs">{errors.terms.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#00c3a0] to-[#00ffc3] text-gray-900 font-bold py-3 px-4 rounded-xl shadow-[0_4px_20px_rgba(0,255,195,0.25)] hover:shadow-[0_4px_25px_rgba(0,255,195,0.4)] transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 tracking-wider uppercase text-xs"
            >
              {loading ? "Creating Account..." : "SignUp"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-xs text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00ffc3] font-semibold hover:underline decoration-[#00ffc3]/40">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;