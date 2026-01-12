import React from "react";
import {
  House,
  SquareCheckBig,
  CirclePlus,
  BookOpen,
  CircleQuestionMark,
} from "lucide-react";

export default function ProjectLeft() {
  return (
    <div className="">
      <div className="flex flex-col gap-2 m-4">
        <div className="text-xl">Manage Your Task</div>
        <span className="text-gray-400">TaskEasy</span>
      </div>
      {/* Left menu bars */}
      <div className="flex flex-col mt-8">
        <div className="px-4 bg-gray-400/20">
          <div className="flex items-center gap-4  p-2 cursor-pointer">
            <House />
            <span className="text-lg">Overview</span>
          </div>
        </div>
        <div className="px-4 ">
          <div className="flex items-center gap-4  p-2 cursor-pointer">
            <SquareCheckBig />
            <span className="text-lg">Starter Checklist</span>
          </div>
        </div>

        <div className="px-4 ">
          <div className="flex items-center gap-4  p-2 cursor-pointer">
            <CirclePlus />
            <span className="text-lg">Create</span>
          </div>
        </div>
        <div className="px-4 ">
          <div className="flex items-center gap-4  p-2 cursor-pointer">
            <BookOpen />
            <span className="text-lg">Learn and optimize</span>
          </div>
        </div>
        <div className="px-4 ">
          <div className="flex items-center gap-4  p-2 cursor-pointer">
            <CircleQuestionMark />
            <span className="text-lg">Help</span>
          </div>
        </div>
      </div>
    </div>
  );
}
