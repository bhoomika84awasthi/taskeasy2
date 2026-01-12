import React, { useState } from "react";
import { Search } from "lucide-react";

export default function CdicTerminal() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Jobs", "Logs", "Artifacts", "Variables"];

  return (
    <div className="border border-gray-300 rounded-lg bg-white w-auto shadow-lg mx-6">
      <div className="flex flex-col w-full gap-4">
        {/* Top Tabs */}
        <div className="border-b border-gray-300 flex gap-8 p-4 text-gray-600 font-medium">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer pb-2 transition-all duration-200 p-2 
                ${
                  activeTab === tab
                    ? "bg-[#007ED3] text-white rounded-lg"
                    : "hover:text-black"
                }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative p-4 mx-4 w-auto">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search logs"
            className="bg-gray-100 pl-10 pr-3 py-2 rounded-md w-full text-gray-700 font-semibold focus:outline-none"
          />
        </div>

        {/* Terminal */}
        <div className="mx-8 mb-4 border h-[300px] w-auto max-w-full bg-black rounded-lg text-white p-4 overflow-y-auto">
          Terminal
        </div>
      </div>
    </div>
  );
}
