import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const url = `http://localhost:5000/api/projects/${id}`;

  useEffect(() => {
    if (!token) return navigate("/login"); 

    const fetchProject = async () => {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(res.data.title);
        setDescription(res.data.description);
      } catch (err) {
        console.error(err);
        alert("Failed to load project");
      }
    };
    fetchProject();
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Title & description required");

    try {
      setLoading(true);
      await axios.put(
        url,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project updated successfully");
      navigate("/api/projects");
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Project</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          required
          className="border border-gray-300 rounded-md p-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          rows={4}
          required
          className="border border-gray-300 rounded-md p-2 resize-none"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Project"}
        </button>
      </form>
    </div>
  );
}
