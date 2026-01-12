import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProjectName from '../components/ProjectName';
import { useProject } from '../hooks/useProject';
import { createWorkItem } from "../services/workItemService";

const SprintFixed = () => {
  const [showModal, setShowModal] = useState(false);
  const [showWorkItemModal, setShowWorkItemModal] = useState(false);
  const [sprintName, setSprintName] = useState("");
  const [sprintGoal, setSprintGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sprintState, setSprintState] = useState("planned");
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const { projectName } = useProject();
  
  // Work item form states
  const [workItemTitle, setWorkItemTitle] = useState("");
  const [workItemDescription, setWorkItemDescription] = useState("");
  const [workItemType, setWorkItemType] = useState("Task");
  const [workItemState, setWorkItemState] = useState("New");
  const [workItemPriority, setWorkItemPriority] = useState("Medium");
  const [workItemPoints, setWorkItemPoints] = useState("0");

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.projects && res.data.projects.length > 0) {
          setProjects(res.data.projects);
          setSelectedProjectId(res.data.projects[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  React.useEffect(() => {
    if (!selectedProjectId) return;
    const fetchSprints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/projects/${selectedProjectId}/sprints`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.sprints && Array.isArray(res.data.sprints)) {
          setSprints(res.data.sprints);
        }
      } catch (err) {
        console.error("Failed to fetch sprints:", err);
      }
    };
    fetchSprints();
  }, [selectedProjectId]);

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const projectId = selectedProjectId;
      
      if (!projectId) {
        alert("Please select a project first");
        return;
      }
      
      if (!sprintName.trim()) {
        alert("Please enter a sprint name");
        return;
      }
      if (!startDate || !endDate) {
        alert("Please select both start and end dates");
        return;
      }
      
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      if (startDateObj >= endDateObj) {
        alert("End date must be after start date");
        return;
      }

      const payload = {
        name: sprintName,
        goal: sprintGoal,
        startDate: startDateObj,
        endDate: endDateObj,
        state: sprintState,
      };

      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/sprints`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.sprint) {
        setSprints((prev) => [...prev, res.data.sprint]);
        alert("Sprint created successfully!");
      }
      setShowModal(false);
      setSprintName("");
      setSprintGoal("");
      setStartDate("");
      setEndDate("");
      setSprintState("planned");
    } catch (err) {
      alert(`Failed to create sprint: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCreateWorkItem = async (e) => {
    e.preventDefault();
    try {
      if (!selectedProjectId) {
        alert("Please select a project first");
        return;
      }

      if (!workItemTitle.trim()) {
        alert("Please enter a work item title");
        return;
      }

      const payload = {
        title: workItemTitle,
        description: workItemDescription,
        type: workItemType,
        state: workItemState,
        points: parseInt(workItemPoints) || 0,
      };

      const result = await createWorkItem(selectedProjectId, payload);
      
      if (result && result.item) {
        alert("Work item created successfully!");
        setShowWorkItemModal(false);
        setWorkItemTitle("");
        setWorkItemDescription("");
        setWorkItemType("Task");
        setWorkItemState("New");
        setWorkItemPriority("Medium");
        setWorkItemPoints("0");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert(`Failed to create work item: ${errorMsg}`);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white font-display">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3 sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-4 text-[#111418]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white font-bold">T</div>
            <h2 className="text-[#111418] text-lg font-bold">TaskEasy</h2>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 ml-2 pl-4">
            <Link className="text-[#617289] text-sm font-medium hover:text-primary" to="/start">sanexsolution</Link>
            <span className="text-[#617289] text-sm mx-1">/</span>
            <ProjectName className="text-[#617289] text-sm hover:text-primary" />
            <span className="text-[#617289] text-sm mx-1">/</span>
            <Link className="text-[#617289] text-sm hover:text-primary" to="/Board">Boards</Link>
            <span className="text-[#111418] text-sm mx-1 font-medium">Sprints</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center bg-[#f0f2f4] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#617289]">search</span>
            <input className="bg-transparent ml-2 outline-none text-sm" placeholder="Search" />
          </label>
          <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCcZIUhVD1rDxJRKVXcQwyfAi5krIGPci_oXtweEg3eObRnjMvIt2d5VEHtBIAtMc1wUUfD-k_fTY3edtrd_qSC1sdoLBXXDOu_E70i12rLKWt0AZZqHteu-FwJ6HvGiWyS6nT8zJMqdQtNBa4p_Le0rGrTvZmhS_EJlSjVsEgQbJ3HaE50slApI3lge2FMvZIjW-eWLoNb8mR-yUAIDfOFrtzLf1Ho2xkUy5nWXVJikjKCQL1OZ7muw7f9XYivBtEfcY6t8qDOWyA")'}} />
        </div>
      </header>

      <div className="flex h-full">
        <aside className="flex flex-col h-screen w-64 border-r border-slate-200 bg-white text-[#111418] shrink-0">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 h-[72px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#6F42C1] text-white font-bold">P</div>
              <h2 className="text-[#111418] text-base font-bold"><ProjectName className="text-[#111418] text-base font-bold" /></h2>
            </div>
            <button className="p-1 text-slate-500 hover:text-primary rounded-full border border-transparent hover:border-slate-100">
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </div>

          <nav className="flex flex-col p-3 grow">
            <div className="mb-2">
              <h3 className="px-2 pt-2 pb-1 text-xs font-bold uppercase text-slate-500">Overview</h3>
              <ul className="space-y-1">
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]"> 
                      <span className="material-symbols-outlined text-lg">grid_view</span>
                    </span>
                    Overview
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-3">
              <h3 className="px-2 pt-2 pb-1 text-xs font-bold uppercase text-slate-500">Boards</h3>
              <ul className="space-y-1 mt-1">
                <li>
                  <Link to="/Workitem" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]">
                      <span className="material-symbols-outlined text-lg">inventory_2</span>
                    </span>
                    Work Items
                  </Link>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]">
                      <span className="material-symbols-outlined text-lg">dashboard</span>
                    </span>
                    Boards
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]">
                      <span className="material-symbols-outlined text-lg">description</span>
                    </span>
                    Backlogs
                  </a>
                </li>
                <li>
                  <a className="relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-bold bg-[#e6f3ff] text-primary" href="#">
                    <div className="absolute left-0 h-9 w-1 bg-[#0ea5e9] rounded-r-full"></div>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#0ea5e9]">
                      <span className="material-symbols-outlined text-lg">flight_takeoff</span>
                    </span>
                    Sprints
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]">
                      <span className="material-symbols-outlined text-lg">search</span>
                    </span>
                    Queries
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]">
                      <span className="material-symbols-outlined text-lg">alt_route</span>
                    </span>
                    Delivery Plans
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                    </span>
                    Time Log Summary
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]">
                      <span className="material-symbols-outlined text-lg">sync_alt</span>
                    </span>
                    Pipelines
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-[#111418]">
                      <span className="material-symbols-outlined text-lg">inventory_2</span>
                    </span>
                    Artifacts
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div className="mt-auto p-4 border-t border-slate-200">
            <a className="flex items-center gap-3 text-sm font-medium text-[#0ea5e9] hover:underline" href="#">
              <span className="material-symbols-outlined text-xl">settings</span>
              Project settings
            </a>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          <div className="px-10 py-5">
            <div className="flex justify-between items-center gap-2 pt-5 pb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#111418]">{projectName} Team</h1>
                  <button className="text-slate-500 hover:text-primary">
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>

                <div className="flex gap-1">
                  <button className="p-2 text-[#617289] rounded-md hover:bg-slate-100">
                    <span className="material-symbols-outlined text-xl">star_outline</span>
                  </button>
                  <button className="p-2 text-[#617289] rounded-md hover:bg-slate-100">
                    <span className="material-symbols-outlined text-xl">history</span>
                  </button>
                  <button className="p-2 text-[#617289] rounded-md hover:bg-slate-100">
                    <span className="material-symbols-outlined text-xl">settings</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center rounded-lg h-10 border border-slate-300 bg-white text-[#111418] gap-2 text-sm font-bold px-4 hover:bg-slate-50">Column Options</button>
                <button className="flex items-center justify-center rounded-lg h-10 border border-slate-300 bg-white text-[#111418] gap-2 text-sm font-bold px-4 hover:bg-slate-50">Create Query</button>
                <button className="flex items-center justify-center rounded-lg h-10 border border-slate-300 bg-white text-[#111418] gap-2 text-sm font-bold px-4 hover:bg-slate-50" onClick={() => setShowModal(true)}>
                  <span className="material-symbols-outlined text-lg">add</span>
                  <span>Create Sprint</span>
                </button>
                <button className="flex items-center justify-center rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold px-4 hover:opacity-90" onClick={() => setShowWorkItemModal(true)}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                  <span>New Work Item</span>
                </button>
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 z-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowModal(false)} />
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4" style={{ zIndex: 50 }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-lg font-semibold">Create Sprint</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-500">Close</button>
                  </div>
                  <form className="p-4" onSubmit={handleCreateSprint}>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Project</label>
                        <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="w-full px-3 py-2 border rounded" required>
                          <option value="">Select a project</option>
                          {projects.map(project => (
                            <option key={project._id} value={project._id}>{project.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Sprint Name</label>
                        <input value={sprintName} onChange={e => setSprintName(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="e.g., Sprint 1" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Goal</label>
                        <textarea value={sprintGoal} onChange={e => setSprintGoal(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="What is the goal of this sprint?" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium">State</label>
                        <select value={sprintState} onChange={e => setSprintState(e.target.value)} className="w-full px-3 py-2 border rounded">
                          <option value="planned">Planned</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create Sprint</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showWorkItemModal && (
              <div className="fixed inset-0 z-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowWorkItemModal(false)} />
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4" style={{ zIndex: 50 }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-lg font-semibold">Create Work Item</h3>
                    <button onClick={() => setShowWorkItemModal(false)} className="text-gray-500">Close</button>
                  </div>
                  <form className="p-4" onSubmit={handleCreateWorkItem}>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Project</label>
                        <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="w-full px-3 py-2 border rounded" required>
                          <option value="">Select a project</option>
                          {projects.map(project => (
                            <option key={project._id} value={project._id}>{project.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <input value={workItemTitle} onChange={e => setWorkItemTitle(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="e.g., Fix login bug" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea value={workItemDescription} onChange={e => setWorkItemDescription(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Describe the work item" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <select value={workItemType} onChange={e => setWorkItemType(e.target.value)} className="w-full px-3 py-2 border rounded">
                          <option value="Task">Task</option>
                          <option value="Bug">Bug</option>
                          <option value="Feature">Feature</option>
                          <option value="Epic">Epic</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">State</label>
                        <select value={workItemState} onChange={e => setWorkItemState(e.target.value)} className="w-full px-3 py-2 border rounded">
                          <option value="New">New</option>
                          <option value="Active">Active</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Points</label>
                        <input type="number" value={workItemPoints} onChange={e => setWorkItemPoints(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="0" min="0" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowWorkItemModal(false)} className="px-4 py-2 rounded border">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create Work Item</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="flex justify-between items-end border-b border-[#dbe0e6]">
              <div className="flex gap-8">
                <Link to="/Taskboard" className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#617289] pb-[13px] pt-4 hover:border-b-slate-400">
                  <p className="text-sm font-bold">Taskboard</p>
                </Link>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#111418] text-[#111418] pb-[13px] pt-4" href="#">
                  <p className="text-sm font-bold">Backlog</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#617289] pb-[13px] pt-4 hover:border-b-slate-400" href="#">
                  <p className="text-sm font-bold">Analytics</p>
                </a>
              </div>

              <p className="text-[#617289] text-sm pb-4">November Week 3 | 17 November - 21 November | 4 work days remaining</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-24">
              <div className="w-64 h-auto mb-8">
                <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                  <rect fill="#e2e8f0" height="110" rx="12" ry="12" width="160" x="20" y="20"></rect>
                  <rect fill="#cbd5e1" height="12" rx="4" ry="4" width="130" x="35" y="40"></rect>
                  <rect fill="#cbd5e1" height="12" rx="4" ry="4" width="80" x="35" y="65"></rect>
                  <rect fill="#cbd5e1" height="12" rx="4" ry="4" width="100" x="35" y="90"></rect>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#111418] mb-2">You do not have any work scheduled yet.</h3>
              <p className="text-[#617289] mb-6 max-w-md">Schedule work from your product backlog or create new work items to get started with your sprint.</p>
              <button
                className="flex items-center justify-center rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold px-5 py-2.5 hover:opacity-90"
                onClick={() => setShowWorkItemModal(true)}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                <span>New Work Item</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SprintFixed; 
// export default SprintFixed;