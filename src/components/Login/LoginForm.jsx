import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../../services/authService";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const result = await authService.login({ email, password });
      if (result.token) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/api/home");
        }, 1000);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
    }
  };
  const googleLogin = () => {
    // Handle Google login logic here
    console.log("Google login clicked");
  };

  const microsoftLogin = () => {
    // Handle Microsoft login logic here
    console.log("Microsoft login clicked");
  };
  return (
    <div className=" w-full  flex justify-center">
      <div className=" flex flex-col border border-gray-300 bg-gray-100 p-8 rounded-lg shadow-lg sm:w-[350px] items-start justify-center gap-6 px-6">
        <div className="flex font-semibold text-xl w-full justify-center">
          Sign In
        </div>

        <div className="flex flex-col gap-2 mt-4 w-full">
          <label className="font-semibold text-lg">Email</label>
          <input
            className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-semibold"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-lg">Password</label>
          <input
            className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-semibold"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="w-full">
          <button
            className="bg-[#0078D4] text-white font-semibold px-4 py-2 rounded-md w-full hover:bg-[#005a9e]"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </div>
        <div className="text-sm text-gray-600 font-semibold">
          <span>Don't have an account? </span>
          <Link to={"/api/signup"}>
            <span className="text-[#0078D4] cursor-pointer hover:underline">
              Sign Up
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4 justify-center w-full">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <div className="flex gap-4 w-full">
          <button
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition text-sm font-medium w-full"
            onClick={googleLogin}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Google
          </button>
          <button
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition text-sm font-medium w-full"
            onClick={microsoftLogin}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
              alt="Microsoft logo"
              className="w-5 h-5"
            />
            Microsoft
          </button>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
}
