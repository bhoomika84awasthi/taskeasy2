import React, { useState } from "react";
import ProjectLeft from "../components/ProjectLeft";
import ProjectCenter from "../components/ProjectCenter";
import AddTaskModal from "../components/AddTaskModal";
import Navbar from "../components/Navbar";

export default function ProjectManagement() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar />
      <div className="h-screen">
        <div className="flex w-full">
          {/* Left Part */}
          <div className="w-[22%] flex flex-col gap-8 h-screen">
            <ProjectLeft />
          </div>

          {/* Center Part */}
          <div className="w-[60%] border-l border-gray-300">
            <ProjectCenter />
          </div>

          {/* Right Part */}
          <div className="w-[18%] relative p-4">
            <button
              className="w-full px-4 py-2 bg-[#0078D4] cursor-pointer text-white rounded hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              Add New Task
            </button>
          </div>
        </div>

        {/* Slide-in Add Task Panel */}
        <AddTaskModal show={showModal} onClose={() => setShowModal(false)} />
      </div>
    </>
  );
}
