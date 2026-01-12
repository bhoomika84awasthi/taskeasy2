import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskboardSidebar from "../components/TaskboardSidebar";
import { useProject } from '../hooks/useProject';
import { deleteWorkItem } from "../services/workItemService";

/* ErrorBoundary */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <h2 className="text-red-600 font-bold">Something went wrong rendering Sprints</h2>
          <pre className="mt-2 text-sm whitespace-pre-wrap">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const TaskEasySprintsPage = () => {
  const API_URL =
    (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
    "http://localhost:5000/api";

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [sprints, setSprints] = useState([]);
  const [workItems, setWorkItems] = useState({});
  const [showNewSprint, setShowNewSprint] = useState(false);
  const [newSprint, setNewSprint] = useState({ name: "", startDate: "", endDate: "", goal: "" });
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios
      .get(`${API_URL}/projects`, { headers })
      .then((res) => {
        const ps = res.data.projects || [];
        setProjects(ps);
        if (ps.length > 0) setSelectedProjectId(ps[0]._id);
      })
      .catch(() => setPageError("Failed to load projects"));
  }, [API_URL]);

  useEffect(() => {
    if (!selectedProjectId) return;
    setLoading(true);

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .get(`${API_URL}/projects/${selectedProjectId}/sprints`, { headers })
      .then((res) => setSprints(res.data.sprints || []))
      .catch(() => setPageError("Failed to fetch sprints"))
      .finally(() => setLoading(false));
  }, [selectedProjectId, API_URL]);

  // Fetch work items for all sprints
  useEffect(() => {
    if (!selectedProjectId || sprints.length === 0) return;

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchAllWorkItems = async () => {
      const itemsBySprintId = {};
      for (const sprint of sprints) {
        try {
          const res = await axios.get(
            `${API_URL}/projects/${selectedProjectId}/workitems?sprintId=${sprint._id}`,
            { headers }
          );
          itemsBySprintId[sprint._id] = res.data.workitems || [];
        } catch (err) {
          console.error(`Failed to fetch work items for sprint ${sprint._id}:`, err);
          itemsBySprintId[sprint._id] = [];
        }
      }
      setWorkItems(itemsBySprintId);
    };

    fetchAllWorkItems();
  }, [selectedProjectId, sprints, API_URL]);

  async function createSprint(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      setLoading(true);
      const payload = { ...newSprint };
      const res = await axios.post(
        `${API_URL}/projects/${selectedProjectId}/sprints`,
        payload,
        { headers }
      );
      setSprints((prev) => [res.data.sprint, ...prev]);
      setShowNewSprint(false);
      setNewSprint({ name: "", startDate: "", endDate: "", goal: "" });
    } catch {
      alert("Failed to create sprint");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSprint(id) {
    if (!confirm("Delete this sprint?")) return;

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await axios.delete(`${API_URL}/projects/${selectedProjectId}/sprints/${id}`, {
        headers,
      });
      setSprints((prev) => prev.filter((s) => s._id !== id));
      setWorkItems((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch {
      alert("Failed to delete sprint");
    }
  }

  async function handleDeleteWorkItem(sprintId, workItemId) {
    if (!confirm("Delete this work item?")) return;

    try {
      await deleteWorkItem(selectedProjectId, workItemId);
      setWorkItems((prev) => ({
        ...prev,
        [sprintId]: prev[sprintId].filter((item) => item._id !== workItemId),
      }));
    } catch {
      alert("Failed to delete work item");
    }
  }

  async function updateSprintState(id, next) {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await axios.patch(
        `${API_URL}/projects/${selectedProjectId}/sprints/${id}`,
        { state: next },
        { headers }
      );
      setSprints((prev) => prev.map((s) => (s._id === id ? res.data.sprint : s)));
    } catch {
      alert("Failed to update");
    }
  }

  const { projectName } = useProject();

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen w-full bg-white font-display">
        {/* Sidebar Navigation */}
        <TaskboardSidebar projectName={projectName} />

        {/* Main Content Area with left padding to accommodate sidebar */}
        <div className="ml-64">
          {/* Header */}
          <div className="px-8 py-6 border-b">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold">{projectName} Team</h1>
                </div>

                <nav className="flex items-center gap-6 text-sm text-slate-600 mt-4">
                  <button className="px-1 py-2">Taskboard</button>
                  <button className="px-1 py-2 border-b-2 border-slate-800 font-medium">
                    Backlog
                  </button>
                  <button className="px-1 py-2">Analytics</button>
                </nav>
              </div>

              {/* RIGHT BUTTONS */}
              <div className="flex flex-col items-end gap-3">
                <div className="text-sm text-slate-600">November Week 3 | 17 - 21 Nov | 4 days left</div>

                <div className="flex items-center gap-2">
                  <button className="rounded-md border px-3 py-2 text-sm bg-white hover:bg-slate-50">
                    Column Options
                  </button>

                  <button
                    onClick={() => setShowNewSprint(true)}
                    className="rounded-md border px-3 py-2 text-sm bg-white hover:bg-slate-50"
                  >
                    + Create Sprint
                  </button>

                  <button className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">add</span> New Work Item
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-8 py-10">
            {sprints.length === 0 && !loading && (
              <div className="text-center">
                <h2 className="text-lg font-semibold">You do not have any work scheduled yet.</h2>
              </div>
            )}

            {sprints.map((s) => (
              <div
                key={s._id}
                className="rounded-md border p-4 shadow-sm w-full max-w-3xl mb-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{s.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateSprintState(s._id, s.state === "active" ? "completed" : "active")
                      }
                      className="text-sm rounded px-3 py-1 border hover:bg-slate-100"
                    >
                      {s.state === "active" ? "Complete" : "Start"}
                    </button>

                    <button
                      onClick={() => deleteSprint(s._id)}
                      className="text-sm rounded px-3 py-1 border text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Work Items for this sprint */}
                <div className="space-y-2">
                  {(workItems[s._id] || []).length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No work items in this sprint</p>
                  ) : (
                    (workItems[s._id] || []).map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {item.state}
                          </span>
                          <button
                            onClick={() => handleDeleteWorkItem(s._id, item._id)}
                            className="text-sm rounded px-2 py-1 text-red-600 hover:bg-red-100 border border-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL */}
        {showNewSprint && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowNewSprint(false)} />
            <div className="relative z-10 w-full max-w-md rounded bg-white p-6 shadow-lg">
              <h2 className="text-lg font-medium mb-4">Create Sprint</h2>
              <form onSubmit={createSprint} className="space-y-3">
                <input
                  value={newSprint.name}
                  onChange={(e) =>
                    setNewSprint((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="Sprint Name"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={newSprint.startDate}
                    onChange={(e) =>
                      setNewSprint((p) => ({ ...p, startDate: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="date"
                    value={newSprint.endDate}
                    onChange={(e) =>
                      setNewSprint((p) => ({ ...p, endDate: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <textarea
                  value={newSprint.goal}
                  onChange={(e) =>
                    setNewSprint((p) => ({ ...p, goal: e.target.value }))
                  }
                  rows="3"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Sprint goal (optional)"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewSprint(false)}
                    className="border rounded px-3 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default TaskEasySprintsPage;
