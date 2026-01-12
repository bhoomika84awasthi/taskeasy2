import Navbar from "../components/Navbar";
import Welcome from "../components/Welcome";
import CenterCards from "../components/CenterCards";
import End from "../components/End";
import MobileBottomNav from "../components/MobileBottomNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// jwt decoding not needed in Home; if required use ../utils/decodeJWT
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();


  return (
    <div className="relative min-h-screen bg-[#F8F8F9]">
      <Navbar />

      <main className="pt-[60px] pb-[60px] md:pb-0">
        <Welcome />
        <CenterCards />
        <div className="w-full text-center md:text-left mx-4 md:mx-16 font-semibold font-[Times_New_Roman] text-lg mb-4">
          TaskEasy Services
        </div>
        <End />
      </main>

      <MobileBottomNav />
    </div>
  );
}
