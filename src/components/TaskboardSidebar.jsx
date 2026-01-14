import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useProject } from "../hooks/useProject";
import {
  LayoutGrid,
  LayoutList,
  ListTodo,
  Clipboard,
  Zap,
  Search,
  TrendingUp,
  Clock,
  GitBranch,
  Archive,
  Plus,
} from "lucide-react";

export default function TaskboardSidebar({ projectName }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { projectName: ctxProjectName } = useProject();
  const displayProjectName = projectName || ctxProjectName || "ProdigiSign";

  const isActive = (path) => location.pathname.toLowerCase().includes(path.toLowerCase());

  const handleNavigate = async (path) => {
    // If navigating away from current project pages, try to pass project state
    const params = new URLSearchParams(location.search);
    const projectId = params.get('projectId');
    if (path === 'projectSettings') {
      if (projectId) {
        navigate(`/project/${projectId}`);
        return;
      }
      // fallback
      navigate('/project');
      return;
    }

    if (projectId) {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate(path, { state: { project: res.data.project || res.data } });
      } catch (err) {
        console.error('Failed to fetch project:', err);
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const menuItems = [
    {
      category: "OVERVIEW",
      items: [
        { label: "Overview", icon: LayoutGrid, path: "/summary" },
      ],
    },
    {
      category: "BOARDS",
      items: [
        { label: "Work Items", icon: ListTodo, path: "/Workitem" },
        { label: "Boards", icon: LayoutList, path: "/Board" },
        { label: "Backlogs", icon: Clipboard, path: "/Board" },
        { label: "Sprints", icon: Zap, path: "/Sprint" },
        { label: "Queries", icon: Search, path: "/queries" },
        { label: "Delivery Plans", icon: TrendingUp, path: "/deliverypage" },
        { label: "Time Log Summary", icon: Clock, path: "/timelogsummary" },
        { label: "Pipelines", icon: GitBranch, path: "/pipelines" },
        { label: "Artifacts", icon: Archive, path: "/library" },
      ],
    },
  ];

  return (
    <div className="fixed left-0 top-0 pt-20 w-64 h-screen bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      {/* Project Header (logo + name) */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-600 text-white font-semibold text-lg">
            {String(displayProjectName || "")[0]?.toUpperCase() || "S"}
          </div>
          <h2 className="text-sm font-semibold text-gray-900">{displayProjectName}</h2>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 py-4 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            {/* Section Title */}
            <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.category}
            </h3>

            {/* Menu Items */}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={itemIdx}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-all ${
                      active
                        ? "bg-gray-200 text-gray-900 rounded-l-lg border-l-4 border-black"
                        : "text-gray-700 hover:bg-gray-100 rounded-md"
                    }`}
                  >
                    <span className={`w-9 h-9 flex items-center justify-center rounded-md flex-shrink-0 border ${active ? 'bg-white border-gray-300' : 'bg-white border-gray-200'}`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-700'}`} />
                    </span>
                    <span className="ml-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
