import React, { useState, useEffect } from "react";
import { GitFork, GitBranch, Funnel, Bookmark } from "lucide-react";
import { useProject } from '../../hooks/useProject';

export default function CdicLeft() {
  const [repositories, setRepositories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState("");
  const { projectId: activeProjectId } = useProject();

  // Fetch repositories
  useEffect(() => {
    fetch("/api/repositories")
      .then((res) => res.json())
      .then((data) => setRepositories(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch branches when repository changes
  useEffect(() => {
    if (!selectedRepo) return;
    fetch(`/api/repositories/${selectedRepo}/branches`)
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error(err));
  }, [selectedRepo]);

  // Fetch saved pipelines (project-scoped)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const projectId = activeProjectId || localStorage.getItem('activeProjectId') || selectedRepo || null;
    const url = projectId ? `/api/projects/${encodeURIComponent(projectId)}/pipelines` : '/api/pipelines';
    fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((res) => res.json())
      .then((data) => setPipelines(data.pipelines || data || []))
      .catch((err) => console.error(err));
  }, [activeProjectId, selectedRepo]);

  // Add repository
  const addRepository = () => {
    const repoName = prompt("Enter new repository name:");
    if (!repoName) return;

    fetch("/api/repositories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: repoName }),
    })
      .then((res) => res.json())
      .then((newRepo) => setRepositories([...repositories, newRepo]))
      .catch((err) => console.error(err));
  };

  // Add branch
  const addBranch = () => {
    if (!selectedRepo) return alert("Select a repository first!");
    const branchName = prompt("Enter new branch name:");
    if (!branchName) return;

    fetch(`/api/repositories/${selectedRepo}/branches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: branchName }),
    })
      .then((res) => res.json())
      .then((newBranch) => setBranches([...branches, newBranch]))
      .catch((err) => console.error(err));
  };

  // Handle status click
  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    fetch(`/api/items?status=${status}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Filtered items:", data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col gap-2 mt-4 h-screen">
      {/* Repositories Section */}
      <div className="w-full flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <GitFork />
            <span className="font-semibold">Repository</span>
          </div>
          <button
            onClick={addRepository}
            className="bg-blue-500 text-white w-6 h-6 flex justify-center items-center rounded-md 
                       cursor-pointer hover:bg-blue-600 transition-colors duration-200"
          >
            +
          </button>
        </div>

        <select
          value={selectedRepo}
          onChange={(e) => {
            setSelectedRepo(e.target.value);
            setSelectedBranch("");
          }}
          className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
        >
          <option value="">Select repository</option>
          {repositories.map((repo) => (
            <option key={repo.id} value={repo.id}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Branches */}
      <div className="w-full flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <GitBranch />
            <span className="font-semibold">Branch</span>
          </div>
          <button
            onClick={addBranch}
            className="bg-blue-500 text-white w-6 h-6 flex justify-center items-center rounded-md 
                       cursor-pointer hover:bg-blue-600 transition-colors duration-200"
          >
            +
          </button>
        </div>

        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full text-gray-700 font-medium"
        >
          <option value="">Select branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filters */}
      <div className="flex flex-col">
        <div className="w-full flex gap-2 p-4">
          <Funnel />
          <span className="font-medium">Status Filters</span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-2">
          {["Success", "Failed", "Running", "Queued"].map((status) => (
            <div
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`${
                status === "Success"
                  ? "bg-green-400"
                  : status === "Failed"
                  ? "bg-red-400"
                  : status === "Running"
                  ? "bg-yellow-400"
                  : "bg-gray-400"
              } text-white p-2 rounded-md cursor-pointer ${
                selectedStatus === status ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {status}
            </div>
          ))}
        </div>
      </div>

      {/* Pipelines */}
      <div className="w-full flex flex-col gap-4 p-4">
        <div className="w-full flex gap-2">
          <Bookmark />
          <span className="font-semibold">Saved Pipelines</span>
        </div>
        <div>
          <select
            value={selectedPipeline}
            onChange={(e) => setSelectedPipeline(e.target.value)}
            className="flex p-2 w-full border border-gray-300 rounded-md text-gray-700 font-medium"
          >
            <option value="">Select Pipeline</option>
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
