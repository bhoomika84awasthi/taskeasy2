import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateProject({ onCreate }) {
  const [logo, setLogo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const url = "http://localhost:5000/api/projects";

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !description) {
    toast.error("Please fill in all required fields!");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (logo) formData.append('logo', logo);

    // Don't set Content-Type; let the browser set the boundary for multipart/form-data
    const res = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Project created successfully!");
    // Notify parent instead of navigating; parent will refresh and close modal
    setTitle("");
    setDescription("");
    onCreate && onCreate(res.data);

  } catch (err) {
    console.error(err.response?.data || err.message);
    const errorMsg =
      err.response?.data?.message ||
      err.message ||
      "Failed to create project.";
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2 className="text-xl font-bold mb-4">Create Project</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            className="border border-gray-300 rounded-md p-2 w-full resize-none"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
