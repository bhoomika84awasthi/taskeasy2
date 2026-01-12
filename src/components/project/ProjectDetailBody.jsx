import React, { useState } from "react";
import {
  Slack,
  PanelsTopLeft,
  Archive,
  LayoutDashboard,
  NotebookPen,
  Presentation,
  GitBranch,
  PipetteIcon,
  FlaskConical,
  Newspaper,
  Lock,
  Star,
  Heart,
  List,
  Layers,
  Calendar,
  Clock,
  Activity,
  BarChart,
  FileText,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import ProjectStat from "./ProjectStat";

import WorkItem from "../Boards/WorkItem";
import Boards from "./boardSubitem/Boards";
import BacklogSection from "./boardSubitem/BacklogSection";
import Sprint from "./boardSubitem/Sprint";
import WikiPage from "../../pages/WikiPage";

export default function ProjectDetailBody({ project }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [boardsOpen, setBoardsOpen] = useState(false); // Dropdown state

  const renderContent = () => {
    switch (activeTab) {
      case "Wiki":
        return  <WikiPage project={project}/>;
      case "Overview":
        return (
          <div className="flex flex-col sm:flex-row p-4 sm:p-8 gap-6">
            <div className="w-full sm:w-[60%] shadow-lg p-4">
              <div className="flex flex-col gap-8">
                <div className="flex justify-between">
                  <span className="text-2xl font-semibold">
                    About This Project
                  </span>
                  <span className="flex items-center gap-2">
                    <Heart size={18} />
                    Like <span>0</span>
                  </span>
                </div>
                <span>{project.description}</span>
              </div>
            </div>
            <div className="w-full sm:w-[40%] p-4">
              <ProjectStat />
            </div>
          </div>
        );

      case "Work Items":
        return <WorkItem />;

      case "Boards":
        return <Boards/>;

      case "Backlogs":
        return <BacklogSection/>

      case "Sprint":
        return <Sprint/>

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-600 text-lg">
            {activeTab} page is under development.
          </div>
        );
    }
  };

  const menuItems = [
    { name: "Overview", icon: PanelsTopLeft },
    { name: "Summary", icon: Archive },
    { name: "Dashboards", icon: LayoutDashboard },
    { name: "Wiki", icon: NotebookPen },
    { name: "Boards", icon: Presentation },
    { name: "Repos", icon: GitBranch },
    { name: "Pipelines", icon: PipetteIcon },
    { name: "Test Plans", icon: FlaskConical },
    { name: "Artifacts", icon: Newspaper },
  ];

  const boardsSubItems = [
    { name: "Work Items", icon: List },
    { name: "Boards", icon: Layers },
    { name: "Backlogs", icon: FileText },
    { name: "Sprint", icon: Calendar },
    { name: "Queries", icon: Activity },
    { name: "Delivery Plans", icon: FileText },
    { name: "Analytics Views", icon: BarChart },
    { name: "Plans", icon: FileText },
    { name: "Time Log Summary", icon: Clock },
  ];

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="hidden sm:flex flex-col w-[20%] bg-gray-100">
        <div className="flex gap-4 bg-gray-300 w-full p-4">
          <Slack color="#0078D4" />
          <span className="font-semibold text-xl">{project.title}</span>
        </div>

        <div className="text-gray-700 text-lg flex flex-col gap-2 py-2 h-auto">
          {menuItems.map((item) => {
            if (item.name === "Boards") {
              return (
                <div key={item.name} className="flex flex-col">
                  <div
                    onClick={() => setBoardsOpen(!boardsOpen)}
                    className={`px-4 p-2 cursor-pointer flex justify-between items-center hover:bg-gray-300 transition-all ${
                      boardsOpen ||
                      boardsSubItems.some((sub) => sub.name === activeTab)
                        ? "bg-gray-300 font-semibold"
                        : ""
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <item.icon size={20} /> {item.name}
                    </div>
                    <div>
                      {boardsOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>

                  {boardsOpen && (
                    <div className="flex flex-col ml-6 mt-1 gap-1 bg-gray-200 rounded-md p-1">
                      {boardsSubItems.map((sub) => (
                        <div
                          key={sub.name}
                          onClick={() => setActiveTab(sub.name)}
                          className={`px-2 py-1 cursor-pointer flex gap-2 items-center hover:bg-gray-300 rounded ${
                            activeTab === sub.name
                              ? "bg-gray-300 font-semibold"
                              : ""
                          }`}
                        >
                          <sub.icon size={16} /> {sub.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`px-4 p-2 cursor-pointer flex gap-2 items-center hover:bg-gray-300 transition-all ${
                  activeTab === item.name ? "bg-gray-300 font-semibold" : ""
                }`}
              >
                <item.icon size={20} /> {item.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="h-screen w-full sm:w-[80%] flex flex-col">
        {/* Mini Navbar */}
        <div className="flex items-center h-[80px] w-full bg-white shadow-lg px-4">
          <div className="flex gap-4 items-center w-full p-4 ">
            <Slack size={48} color="#0078D4" />
            <span className="font-semibold text-3xl">{project.title}</span>
          </div>
          <div className="flex gap-6 items-center text-gray-600">
            <div className="flex gap-2 items-center bg-gray-300 p-2 rounded-md">
              <Lock size={18} /> <span className="text-gray-700">Private</span>
            </div>
            <div>
              <Star size={18} />
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
