import {
  ArrowDown,
  ChevronDown,
  ChevronUp,
  CircleArrowRight,
  Expand,
  Group,
  GroupIcon,
  Icon,
  LayoutDashboardIcon,
  Menu,
  Settings,
  Star,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import BoardSection from "./BoardSection";

export default function Boards() {
  const [chev, setChev] = useState(false);
  const [like, setLike] = useState(false);
  const [sChev, setSchev] = useState(false);
  const [activeTab, setActiveTab] = useState("board");

  //TODO : functionality not defined
  const toggleChev = () => {
    setChev(!chev);
  };

  const handleUsers = () => {};

  return (
    <div>
      <div className="flex flex-col p-8 gap-4">
        {/* //Top Line */}
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
              <Users size={20} />{" "}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg cursor-pointer">
            <CircleArrowRight size={20} />
            View as Backlog
          </div>
          {/* after this topline ends */}
        </div>

        {/* Second Line */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm">
            <div
              className={`cursor-pointer pb-1 ${
                activeTab === "board"
                  ? "text-[#0078D4] border-b-2 border-[#0078D4]"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("board")}
            >
              Board
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

          <div className="flex items-center gap-4 text-sm">
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={() => setSchev(!sChev)}
            >
              Stories{" "}
              {sChev ? <ChevronUp size={18} /> : <ChevronDown size={18} />}{" "}
            </div>
            <div className="cursor-pointer">
              <Menu size={18} />
            </div>
            <div className="cursor-pointer">
              <Settings size={18} />
            </div>
            <div className="cursor-pointer">
              <Expand size={18} />
            </div>
          </div>
        </div>
              
        <div className="mt-4">
        {activeTab === "board" && (
          <div className="bg-gray-50 rounded-lg shadow">
            <BoardSection/>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="font-semibold">Analytics Section</h2>
            <p>This is the analytics view.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
