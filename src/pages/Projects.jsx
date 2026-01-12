import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import DisplayProject from "../components/project/DisplayProject";

export default function Projects() {
  const baseURL = "http://localhost:5001/api/projects";
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get(baseURL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch projects");
    }
  };

  // Create or Update project
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        await axios.put(
          `${baseURL}/${editId}`,
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditId(null);
      } else {
        // Create
        await axios.post(
          baseURL,
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to save project");
    }
  };

  // Edit project
  const handleEdit = (project) => {
    setEditId(project._id);
    setTitle(project.title);
    setDescription(project.description);
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${baseURL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
   <>
    <Navbar/>
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Manager</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border p-4 rounded-lg mb-6"
      >
        <input
          className="border p-2 rounded"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Update Project" : "Add Project"}
        </button>
      </form>

      <div>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <DisplayProject projects={projects} setProjects={setProjects} />
        )}
      </div>
    </div>
   </>
  );
}
