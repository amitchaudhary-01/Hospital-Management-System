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
        address: data.address,
      });

      toast.success(res.message);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {

  console.log(error);
  console.log(error.message);
  console.log(error.code);
  console.log(error.response);

  toast.error(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex items-center justify-center py-10 px-4">

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-blue-700 text-white p-10 flex flex-col justify-between relative">

          <div className="absolute -top-12 -left-12 w-44 h-44 bg-blue-500 rounded-full blur-3xl opacity-40"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">
              Hospital <br />
              Management System
            </h2>

            <p className="text-blue-100 leading-7">
              Create your patient account to book appointments, manage your
              health records, and communicate with doctors securely.
            </p>
          </div>

          <div className="relative z-10 border-t border-blue-500 pt-6 mt-10">
            <div className="grid grid-cols-2 gap-4">

              <div>
                <h3 className="text-3xl font-bold">100+</h3>
                <p className="text-sm text-blue-100">
                  Expert Doctors
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="text-sm text-blue-100">
                  Healthcare Support
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Section */}

        <div className="w-full md:w-1/2 p-10">

          <h2 className="text-3xl font-bold mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-8">
            Register to access the Hospital Management System.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}

            <div>
              <label className="text-sm font-semibold">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter Full Name"
                className={`w-full mt-2 px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
                {...register("name", {
                  required: "Full Name is required",
                })}
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}

            <div>
              <label className="text-sm font-semibold">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter Email"
                className={`w-full mt-2 px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email",
                  },
                })}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}

            <div>
              <label className="text-sm font-semibold">
                Password
              </label>

              <input
                type="password"
                placeholder="Password"
                className={`w-full mt-2 px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600"
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Contact */}

            <div>
              <label className="text-sm font-semibold">
                Contact Number
              </label>

              <input
                type="text"
                placeholder="98XXXXXXXX"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-600"
                {...register("contactNumber")}
              />
            </div>

            {/* Address */}

            <div>
              <label className="text-sm font-semibold">
                Address
              </label>

              <textarea
                rows="3"
                placeholder="Enter Address"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-600"
                {...register("address")}
              />
            </div>

            {/* Terms */}

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1"
                {...register("terms", {
                  required: "Please accept Terms & Conditions",
                })}
              />

              <p className="text-sm text-gray-500">
                I agree to the Terms & Conditions.
              </p>
            </div>

            {errors.terms && (
              <p className="text-red-500 text-sm">
                {errors.terms.message}
              </p>
            )}

            {/* Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default SignUp;