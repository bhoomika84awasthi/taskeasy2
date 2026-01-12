import React, { useEffect, useState } from "react";
import ProjectNavbar from "../components/project/ProjectNavbar";
import ProjectDetailBody from "../components/project/ProjectDetailBody";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = "http://localhost:5001/api/projects";

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.info("Please login first");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProject(res.data);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch project details"
        );

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!project) return <div className="p-4">Project not found</div>;

  return (
    <div>
      {/* Navbar */}
      <ProjectNavbar />

      {/* Project detail body */}
      {/* Pass the fetched project as prop */}
      <ProjectDetailBody project={project} />
    </div>
  );
}
