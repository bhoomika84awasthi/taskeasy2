import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../services/authService";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    gst: "",
    organization: "",
    contact: "",
    employeeCount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error(error.message || "Signup failed. Try again.");
      console.error(error);
    }
  };

  const googleLogin = () => console.log("Google login clicked");
  const microsoftLogin = () => console.log("Microsoft login clicked");

  return (
    <div className="mt-10 mb-8 flex justify-center px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full sm:w-[800px] bg-gray-100 border border-gray-300 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="grid sm:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="font-semibold text-sm flex items-center gap-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold text-sm flex items-center gap-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label className="font-semibold text-sm flex items-center gap-1">
              Contact <span className="text-red-500">*</span>
            </label>
            <input
              name="contact"
              type="text"
              placeholder="Enter your contact number"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          {/* GST (Optional) */}
          <div>
            <label className="font-semibold text-sm flex items-center gap-1">
              GST Number <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              name="gst"
              type="text"
              placeholder="Enter your GST number"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
              value={formData.gst}
              onChange={handleChange}
            />
          </div>

          {/* Organization */}
          <div>
            <label className="font-semibold text-sm flex items-center gap-1">
              Organization <span className="text-red-500">*</span>
            </label>
            <input
              name="organization"
              type="text"
              placeholder="Enter your organization"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
              value={formData.organization}
              onChange={handleChange}
              required
            />
          </div>

          {/* Employee Count */}
          <div>
            <label className="font-semibold text-sm flex items-center gap-1">
              Number of Employees <span className="text-red-500">*</span>
            </label>
            <select
              name="employeeCount"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
              value={formData.employeeCount}
              onChange={handleChange}
              required
            >
              <option value="">Select number of employees</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="font-semibold text-sm flex items-center gap-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-semibold text-sm flex items-center gap-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              name="password2"
              type="password"
              placeholder="Re-enter your password"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sign Up Button */}
          <div className="w-full flex justify-center sm:col-span-2 mt-4">
            <button
              type="submit"
              className="bg-[#0078D4] text-white font-semibold py-2 rounded-md w-full sm:w-[300px] hover:bg-[#005a9e] transition"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-sm text-gray-600 font-semibold mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-[#0078D4] hover:underline cursor-pointer">
            Sign in
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 justify-center w-full mt-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex gap-4 mt-4 flex-col sm:flex-row">
          <button
            onClick={googleLogin}
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition text-sm font-medium w-full"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Google
          </button>

          <button
            onClick={microsoftLogin}
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition text-sm font-medium w-full"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
              alt="Microsoft logo"
              className="w-5 h-5"
            />
            Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
