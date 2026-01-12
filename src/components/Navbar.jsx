import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Menu,
  Mail,
  Bell,
  Settings,
  CircleQuestionMark,
  X,
} from "lucide-react";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import decodeJWT from "../utils/decodeJWT";

export default function Navbar() {
  // State to control mobile drawer visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState({ email: "", id: "" });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("token", "");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode token
      const decoded = decodeJWT(token);
      console.log("Decoded token:", decoded);
      setUser((prev) => ({ ...prev, id: decoded?.id || decoded?.sub || '', email: decoded?.email || '' }));
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[60px] bg-[#0078D4] flex items-center justify-between px-4 md:px-8 z-50 shadow-md">
        {/* === Mobile layout === */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* menu icon */}
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="text-white/90" />
          </button>

          {/* Center: App name */}
          <div className="text-white/90 text-lg font-semibold">TaskEasy</div>

          {/* Right: User profile image */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbmh5wfW_a0HCIAcyIX2MAZmlkvTWPNmcLNh2FGkcr4SF-aCtMNLMKbOKkifm7GM22BOrez8I-w_tQKWlOPa089MDA0qmWx0pZEgKvU0pQ"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
        </div>

        {/* === Desktop layout === */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Left section: icons and title */}
          <div className="flex gap-3 items-center">
            <LayoutGrid className="text-white/90 cursor-pointer" />
            <Menu className="text-white/90 cursor-pointer" />
            <div className="text-white/90 text-lg font-semibold">TaskEasy</div>
          </div>

          <div className="flex-1 mx-6">
            <SearchBar />
          </div>

          {/*profile */}
          <div className="flex items-center gap-3 text-white/90">
            <Mail className="cursor-pointer" />
            <Bell className="cursor-pointer" />
            <Settings className="cursor-pointer" />
            <CircleQuestionMark className="cursor-pointer" />
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbmh5wfW_a0HCIAcyIX2MAZmlkvTWPNmcLNh2FGkcr4SF-aCtMNLMKbOKkifm7GM22BOrez8I-w_tQKWlOPa089MDA0qmWx0pZEgKvU0pQ"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            {/* User email and ID */}
            <div className="hidden md:flex flex-col text-[12px]">
              <span>{user.email}</span>
              <span className="text-white/60">User ID : 1234</span>
            </div>
            <div
              className="bg-red-500 p-2 rounded-lg text-sm cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        </div>
      </nav>

      <div className="h-[60px]" />

      {/*  Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          {/* Drawer panel */}
          <div className="w-3/4 max-w-xs h-full bg-[#0078D4] text-white shadow-md p-4">
            {/* Close button (top-left) */}
            <div className="flex justify-start mb-4">
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="text-white" size={24} />
              </button>
            </div>

            {/* SearchBar inside drawer */}
            <div className="mb-6">
              <SearchBar />
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-5 text-white/90">
              <div className="flex items-center gap-3 cursor-pointer">
                <Mail size={20} />
                <span>Mail</span>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Bell size={20} />
                <span>Notifications</span>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <Settings size={20} />
                <span>Settings</span>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <CircleQuestionMark size={20} />
                <span>Help</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
