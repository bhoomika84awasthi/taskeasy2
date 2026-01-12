import React, { useState } from "react";
import {
  LayoutDashboardIcon,
  ChevronUp,
  ChevronDown,
  Star,
  Users,
  CircleArrowRight,
  Wrench,
} from "lucide-react";

export default function BacklogSection() {
  const [chev, setChev] = useState(false);
  const [like, setLike] = useState(false);
  const [activeTab, setActiveTab] = useState("backlogs");

  const [backLogData, setBackdata] = useState([]);

  const toggleChev = () => setChev(!chev);
  const handleUsers = () => {};

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-white">
      {/* Top Header Section */}
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <LayoutDashboardIcon />
          <span className="text-lg font-semibold">Project Name</span>

          <div className="cursor-pointer" onClick={toggleChev}>
            {chev ? <ChevronUp /> : <ChevronDown />}
          </div>

          <div className="cursor-pointer" onClick={() => setLike(!like)}>
            <Star
              size={20}
              stroke={like ? "red" : "black"}
              fill={like ? "red" : "none"}
            />
          </div>

          <div className="cursor-pointer" onClick={handleUsers}>
            <Users size={20} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-[#0078D4] text-white p-2 rounded-lg cursor-pointer">
            + New Work Item
          </div>
          <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg cursor-pointer">
            <CircleArrowRight size={18} />
            View as Board
          </div>
          <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg cursor-pointer">
            <Wrench size={18} />
            Column Options
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm">
          <div
            className={`cursor-pointer pb-1 ${
              activeTab === "backlogs"
                ? "text-[#0078D4] border-b-2 border-[#0078D4]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("backlogs")}
          >
            Backlogs
          </div>

          <div
            className={`cursor-pointer pb-1 ${
              activeTab === "analytics"
                ? "text-[#0078D4] border-b-2 border-[#0078D4]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-4 flex-1">
        {activeTab === "backlogs" && (
          <>
            {backLogData.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-[70vh]">
                {/* Illustration Placeholder */}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                  alt="backlog illustration"
                  className="w-40 mb-4"
                />

                <h2 className="text-2xl font-semibold mb-2">
                  Get started with your product backlog
                </h2>
                <p className="text-gray-600 mb-4">
                  Use the <b>"New Work Item"</b> command to create and prioritize work items
                </p>

                <button className="cursor-pointer bg-[#0078D4] text-white px-4 py-2 rounded-md mb-2 hover:bg-[#006bbd]">
                  New Work Item
                </button>

                <a
                  href="#"
                  className="text-[#0078D4] text-sm hover:underline"
                >
                  Learn more about backlogs
                </a>
              </div>
            ) : (
              <div className="text-gray-700">
                {/* Replace this with backlog list rendering */}
                Showing {backLogData.length} backlog items...
              </div>
            )}
          </>
        )}

        {activeTab === "analytics" && (
          <div className="text-gray-700">Analytics content goes here...</div>
        )}
      </div>
    </div>
  );
}
