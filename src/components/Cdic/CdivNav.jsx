import React, { useState } from "react";
import { Folder, ChevronDown, CircleQuestionMark } from "lucide-react";

export default function CdivNav() {

const [query, setQuery] = useState("");

  return (
    <div>
      <div className="bg-[#007ed3] p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white">
          <Folder color="white" />
          <div>My Project</div>
          <div>
            <ChevronDown />
          </div>
          <div className="mx-8 font-medium">TaskEasy</div>
        </div>

        {/* Search bar */}
        <div className=" bg-[#1A88E1] text-white">
          <input
            type="text"
            placeholder="Search pipelines..."
            className="p-2 rounded border border-gray-300 sm:w-[300px]"
          />
        </div>

        <div className="flex items-center gap-4 mr-4">
          <CircleQuestionMark color="white" />
          <div>
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
