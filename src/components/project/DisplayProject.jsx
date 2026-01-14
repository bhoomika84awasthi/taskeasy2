import React, { useState, useEffect, useRef } from "react";
import { Ellipsis, Trash, Pencil, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useProject } from '../../hooks/useProject';

export default function DisplayProject({ projects, setProjects }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const navigate = useNavigate();
  const url = "http://localhost:5000";

  const token = localStorage.getItem("token");

  const { setActiveProject } = useProject();

  const handleToggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEdit = (proj) => {
  navigate(`/project/edit/${proj._id}`);
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(`${url}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted project from local state
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId !== null &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpenMenuId(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-8 p-4">
      {projects.map((proj) => (
        <div
          key={proj._id}
          className="relative p-3 rounded-lg flex w-full sm:w-[400px] justify-between items-start bg-gray-100 transition"
        >
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Set the global active project and navigate to canonical project route
                if (setActiveProject) setActiveProject(proj._id, proj.title || proj.name || null);
                navigate(`/projects/${proj._id}/summary`, { state: { project: proj } });
              }}
              className="flex items-center justify-center size-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 p-2 mr-2 hover:opacity-90"
              aria-label={`Open ${proj.title} start page`}
            >
              <LinkIcon size={20} className="text-purple-600" />
            </button>

            <div className="flex-1 cursor-pointer" onClick={() => navigate(`/project/${proj._id}`)}>
              <h2 className="font-semibold">{proj.title}</h2>
              <p className="text-sm text-gray-600">{proj.description}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(proj);
                  }}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(proj._id);
                  }}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
