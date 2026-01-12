import React, { useState, useEffect } from "react";
import axios from 'axios';

/**
 * TaskEasyBacklogsExact.jsx (updated)
 * - Tailwind CSS required.
 * - Add Google fonts & Material Symbols to public/index.html:
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
 *   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
 *
 * NOTE: this version forces scrollbars inside the layout (center column + right rail)
 * so the visible vertical scrollbars appear on the right side like the screenshot
 * you shared. It uses h-screen + overflow-hidden on the root and overflow-y-scroll
 * on scrolling regions to make scrollbars appear consistently.
 *
 * Reference HTML you uploaded: /mnt/data/TaskEasy Boards_Backlogs Page_6.html
 */
import { Link } from "react-router-dom";
import ProjectName from '../components/ProjectName';
import { useProject } from '../hooks/useProject';

export default function TaskEasyBacklogsExact() {
  const { projectName, projectId: activeProjectId } = useProject();
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [projectIdInput, setProjectIdInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [typeInput, setTypeInput] = useState('User Story');
  const [pointsInput, setPointsInput] = useState('');
  const [boardIdInput, setBoardIdInput] = useState('');
  const [columnIdInput, setColumnIdInput] = useState('');
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [sprintStartDate, setSprintStartDate] = useState('');
  const [sprintEndDate, setSprintEndDate] = useState('');
  const [sprintState, setSprintState] = useState('planned');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [columns, setColumns] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [weekFilter, setWeekFilter] = useState("all");

  const handleEditClick = (item) => {
    setEditingItemId(item._id);
    setTitleInput(item.title);
    setDescInput(item.description || '');
    setTypeInput(item.type);
    setPointsInput(item.points || '');
    setBoardIdInput(item.boardId || '');
    setColumnIdInput(item.columnId || '');
    setShowEdit(true);
  };

  const handleDeleteClick = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this work item?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Not authenticated');
      await axios.delete(`http://localhost:5000/api/projects/${selectedProjectId}/workitems/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkItems(workItems.filter(w => w._id !== itemId));
      alert('Deleted successfully');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete work item';
      alert(msg);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects', { headers: { Authorization: `Bearer ${token}` } });
        const list = res.data?.projects || res.data || [];
        setProjects(list);
        // Respect global active project instead of auto-selecting the first project
        if (activeProjectId) {
          setSelectedProjectId(activeProjectId);
          setProjectIdInput(activeProjectId);
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    })();
  }, [activeProjectId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!selectedProjectId) return setBoards([]);

    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${selectedProjectId}/boards`, { headers: { Authorization: `Bearer ${token}` } });
        const list = res.data?.boards || [];
        setBoards(list);
        if (list.length) {
          setSelectedBoardId(list[0]._id);
          setBoardIdInput(list[0]._id);
          setColumns(list[0].columns || []);
        } else {
          setSelectedBoardId('');
          setBoardIdInput('');
          setColumns([]);
        }
      } catch (err) {
        console.error('Failed to fetch boards', err);
        setBoards([]);
        setColumns([]);
      }
    })();
  }, [selectedProjectId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !selectedProjectId) return setWorkItems([]);

    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${selectedProjectId}/workitems`, { headers: { Authorization: `Bearer ${token}` } });
        const list = res.data?.items || [];
        setWorkItems(list);
      } catch (err) {
        console.error('Failed to fetch work items', err);
        setWorkItems([]);
      }
    })();
  }, [selectedProjectId]);

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchSprints = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/projects/${selectedProjectId}/sprints`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.sprints && Array.isArray(res.data.sprints)) {
          setSprints(res.data.sprints);
        }
      } catch (err) {
        console.error('Failed to fetch sprints:', err);
      }
    };
    fetchSprints();
  }, [selectedProjectId]);

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const filterSprintsByWeek = () => {
    if (weekFilter === "all") return sprints;
    
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();
    
    return sprints.filter(sprint => {
      const sprintStartDate = new Date(sprint.startDate);
      const sprintEndDate = new Date(sprint.endDate);
      const sprintWeek = getWeekNumber(sprintStartDate);
      const sprintYear = sprintStartDate.getFullYear();
      
      if (weekFilter === "current") {
        return sprintWeek === currentWeek && sprintYear === currentYear;
      } else if (weekFilter === "upcoming") {
        return sprintWeek > currentWeek && sprintYear === currentYear;
      } else if (weekFilter === "past") {
        return sprintWeek < currentWeek || sprintYear < currentYear;
      }
      return true;
    });
  };

  const getSavedSprintsByStatus = () => {
    const filtered = filterSprintsByWeek();
    return {
      new: filtered.filter(s => s.state === "planned"),
      active: filtered.filter(s => s.state === "active"),
      resolved: filtered.filter(s => s.state === "completed"),
    };
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Not authenticated');
      
      if (!selectedProjectId) {
        return alert('Please select a project first');
      }
      
      if (!sprintName.trim()) {
        return alert('Please enter a sprint name');
      }
      
      if (!sprintStartDate || !sprintEndDate) {
        return alert('Please select both start and end dates');
      }
      
      const startDateObj = new Date(sprintStartDate);
      const endDateObj = new Date(sprintEndDate);
      
      if (startDateObj >= endDateObj) {
        return alert('End date must be after start date');
      }

      const payload = {
        name: sprintName,
        goal: sprintGoal,
        startDate: startDateObj,
        endDate: endDateObj,
        state: sprintState,
      };

      const res = await axios.post(
        `http://localhost:5000/api/projects/${selectedProjectId}/sprints`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.sprint) {
        setSprints((prev) => [...prev, res.data.sprint]);
        alert('Sprint created successfully!');
      }
      
      setShowSprintModal(false);
      setSprintName('');
      setSprintGoal('');
      setSprintStartDate('');
      setSprintEndDate('');
      setSprintState('planned');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create sprint';
      alert(msg);
    }
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      'User Story': { icon: 'bookmark', color: 'text-blue-600' },
      'Bug': { icon: 'bug_report', color: 'text-red-500' },
      'Task': { icon: 'task_alt', color: 'text-green-500' },
    };
    return iconMap[type] || { icon: 'task_alt', color: 'text-gray-600' };
  };

  const getStateBadge = (state) => {
    const stateMap = {
      'New': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-600' },
      'Active': { bg: 'bg-yellow-50', text: 'text-yellow-800', dot: 'bg-yellow-500' },
      'Done': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    };
    return stateMap[state] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 font-sans text-gray-800">
      {/* Top header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white  border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-600">task_alt</span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg font-semibold">TaskEasy</h1>
              <nav className="text-sm text-gray-500 hidden sm:flex items-center gap-2">
                <span>|</span>
                <a className="hover:underline">sanexsolution</a>
                <span>/</span>
                <ProjectName className="hover:underline" />
                <span>/</span>
                <span className="text-gray-900 font-medium">Backlogs</span>
              </nav>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <span className="material-symbols-outlined text-gray-400 mr-2">search</span>
              <input placeholder="Search" className="bg-transparent outline-none text-sm w-full" />
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('file:///mnt/data/TaskEasy Boards_Backlogs Page_6.html')" }} />
        </div>
      </header>

      {/* Body wrapper: keep full height and hide page-level scroll */}
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-full px-4 py-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-purple-600 text-white flex items-center justify-center font-semibold">P</div>
              <div className="text-sm font-medium"><ProjectName className="text-sm font-medium" /></div>
            </div>
            <button className="p-1 rounded hover:bg-gray-100"><span className="material-symbols-outlined">add</span></button>
          </div>

          <nav className="space-y-1 text-sm">
            <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
              <span className="material-symbols-outlined text-lg">space_dashboard</span>
              <span>Overview</span>
            </div>

            <p className="mt-4 mb-1 text-xs text-gray-400 uppercase">Boards</p>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
                <span className="material-symbols-outlined text-lg">checklist</span>
                <span>Work Items</span>
              </div>
              <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
                <span className="material-symbols-outlined text-lg">view_kanban</span>
                <span>Boards</span>
              </div>
              <div className="flex items-center gap-3 px-2 py-2 rounded bg-blue-50 border-l-4 lue-500">
                <span className="material-symbols-outlined text-lg text-blue-600">view_stream</span>
                <span className="font-semibold text-sm text-blue-900">Backlogs</span>
              </div>

              <Link to="/Taskboard" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
                <span className="material-symbols-outlined">sprint</span>
                <span>Sprints</span>
              </Link>

              <Link to="/queries" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
                <span className="material-symbols-outlined">manage_search</span>
                <span>Queries</span>
              </Link>

              <Link 
                to={`/deliverypage?projectId=${selectedProjectId}`} 
                className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
                <span className="material-symbols-outlined">local_shipping</span>
                <span>Delivery Plans</span>
              </Link>

              <Link 
                to={`/timelogsummary?projectId=${selectedProjectId}`}
                state={{ projectId: selectedProjectId }}
                className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
                <span className="material-symbols-outlined">schedule</span>
                <span>Time Log Summary</span>
              </Link>
            </div>

            <div className="mt-6 space-y-1">
              <Link to="/pipelines" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
                <span className="material-symbols-outlined">sync_alt</span>
                <span>Pipelines</span>
              </Link>
              <Link to="/wiki" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50">
                <span className="material-symbols-outlined">inventory_2</span>
                <span>Artifacts</span>
              </Link>
            </div>
          </nav>

          <div className="mt-auto pt-6">
            <a className="flex items-center gap-3 px-2 py-2 rounded text-blue-600 hover:bg-blue-50">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Project settings</span>
            </a>
          </div>
        </aside>

        {/* Center content column: make this region scrollable (overflow-y-scroll) */}
        <main className="flex-1 px-6 py-6 overflow-hidden">
          <div className="max-w-[920px] mx-auto h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{projectName} Team</h2>
                <div className="text-gray-400">•</div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-gray-50"><span className="material-symbols-outlined">expand_more</span></button>
                  <button className="p-2 rounded hover:bg-gray-50"><span className="material-symbols-outlined">star_outline</span></button>
                  <button className="p-2 rounded hover:bg-gray-50"><span className="material-symbols-outlined">history</span></button>
                  <button className="p-2 rounded hover:bg-gray-50"><span className="material-symbols-outlined">settings</span></button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded border border-gray-200 text-sm">View as Board</button>
                <button className="px-4 py-2 rounded border border-gray-200 text-sm">Column Options</button>
                <button onClick={() => setShowNew(true)} className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined">add</span> New Work Item
                </button>
              </div>
            </div>

            <div className=" border-gray-200 mb-4">
              <div className="flex gap-6">
                <button className="pb-3 -2 lue-600 text-sm font-semibold">Backlog</button>
                <button className="pb-3 text-sm text-gray-500">Analytics</button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm h-[calc(100vh-220px)] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold mb-2">No work items to display</p>
                <p className="text-sm">Work items are managed in the Sprints section below</p>
              </div>
            </div>

            {sprints.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#111418]">Saved Sprints</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWeekFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${weekFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-[#111418] hover:bg-gray-300"}`}
                    >
                      All Weeks
                    </button>
                    <button
                      onClick={() => setWeekFilter("current")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${weekFilter === "current" ? "bg-blue-600 text-white" : "bg-gray-200 text-[#111418] hover:bg-gray-300"}`}
                    >
                      Current Week
                    </button>
                    <button
                      onClick={() => setWeekFilter("upcoming")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${weekFilter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200 text-[#111418] hover:bg-gray-300"}`}
                    >
                      Upcoming
                    </button>
                    <button
                      onClick={() => setWeekFilter("past")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${weekFilter === "past" ? "bg-blue-600 text-white" : "bg-gray-200 text-[#111418] hover:bg-gray-300"}`}
                    >
                      Past
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* New Sprints */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-bold text-[#111418] mb-4">New</h3>
                    <div className="space-y-3">
                      {getSavedSprintsByStatus().new.length > 0 ? (
                        getSavedSprintsByStatus().new.map(sprint => (
                          <div key={sprint._id} className="border border-gray-300 rounded-lg p-3 bg-white hover:shadow-md transition">
                            <div className="font-semibold text-sm text-[#111418]">{sprint.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{sprint.goal}</div>
                            <div className="text-xs mt-2 text-gray-500">
                              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                            </div>
                            <span className="inline-block mt-2 px-2 py-1 rounded text-white text-xs font-semibold bg-blue-500">
                              Planned
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No sprints planned</p>
                      )}
                    </div>
                  </div>

                  {/* Active Sprints */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-bold text-[#111418] mb-4">Active</h3>
                    <div className="space-y-3">
                      {getSavedSprintsByStatus().active.length > 0 ? (
                        getSavedSprintsByStatus().active.map(sprint => (
                          <div key={sprint._id} className="border border-gray-300 rounded-lg p-3 bg-white hover:shadow-md transition">
                            <div className="font-semibold text-sm text-[#111418]">{sprint.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{sprint.goal}</div>
                            <div className="text-xs mt-2 text-gray-500">
                              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                            </div>
                            <span className="inline-block mt-2 px-2 py-1 rounded text-white text-xs font-semibold bg-green-500">
                              Active
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No active sprints</p>
                      )}
                    </div>
                  </div>

                  {/* Resolved Sprints */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-bold text-[#111418] mb-4">Resolved</h3>
                    <div className="space-y-3">
                      {getSavedSprintsByStatus().resolved.length > 0 ? (
                        getSavedSprintsByStatus().resolved.map(sprint => (
                          <div key={sprint._id} className="border border-gray-300 rounded-lg p-3 bg-white hover:shadow-md transition">
                            <div className="font-semibold text-sm text-[#111418]">{sprint.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{sprint.goal}</div>
                            <div className="text-xs mt-2 text-gray-500">
                              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                            </div>
                            <span className="inline-block mt-2 px-2 py-1 rounded text-white text-xs font-semibold bg-gray-500">
                              Completed
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No completed sprints</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* New Work Item Modal (overlay) */}
        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowNew(false)} />
            <div className="bg-white rounded-lg shadow-lg z-60 w-full max-w-lg mx-4">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Create Sprint</h3>
                <button onClick={() => setShowNew(false)} className="text-gray-500">Close</button>
              </div>
              <div className="p-4">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) return alert('Not authenticated');
                    if (!projectIdInput) return alert('Please provide projectId');
                    const payload = {
                      title: titleInput || 'Untitled',
                      description: descInput,
                      type: typeInput,
                      points: Number(pointsInput) || 0,
                      boardId: boardIdInput || null,
                      columnId: columnIdInput || null,
                    };
                    const res = await axios.post(`http://localhost:5000/api/projects/${projectIdInput}/workitems`, payload, { headers: { Authorization: `Bearer ${token}` } });
                    if (res.data && res.data.item) {
                      setWorkItems((prev) => [...prev, res.data.item]);
                    }
                    setShowNew(false);
                    setTitleInput('');
                    setDescInput('');
                    setTypeInput('User Story');
                    setPointsInput('');
                    setBoardIdInput('');
                    setColumnIdInput('');
                  } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data?.message || err?.message || 'Failed to create work item';
                    alert(msg);
                  }
                }}>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Project</label>
                      <select value={selectedProjectId} onChange={(e) => { setSelectedProjectId(e.target.value); setProjectIdInput(e.target.value); }} className="w-full px-3 py-2 border rounded">
                        <option value="">Select a project</option>
                        {projects.map(p => (
                          <option key={p._id || p.id} value={p._id || p.id}>{p.title || p.name || (p._id || p.id)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea value={descInput} onChange={(e) => setDescInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <input value={typeInput} onChange={(e) => setTypeInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Points</label>
                        <input value={pointsInput} onChange={(e) => setPointsInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Board</label>
                        <select value={selectedBoardId} onChange={(e) => {
                            const bid = e.target.value;
                            setSelectedBoardId(bid);
                            setBoardIdInput(bid);
                            const b = boards.find(x => (x._id === bid));
                            setColumns(b?.columns || []);
                          }} className="w-full px-3 py-2 border rounded">
                          <option value="">(none)</option>
                          {boards.map(b => (
                            <option key={b._id} value={b._id}>{b.name || b._id}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Column</label>
                      <select value={columnIdInput} onChange={(e) => setColumnIdInput(e.target.value)} className="w-full px-3 py-2 border rounded">
                        <option value="">(none)</option>
                        {columns.map(c => (
                          <option key={c._id} value={c._id}>{c.name || c._id}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2 rounded border">Cancel</button>
                      <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Work Item Modal */}
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowEdit(false)} />
            <div className="bg-white rounded-lg shadow-lg z-60 w-full max-w-lg mx-4">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Edit Work Item</h3>
                <button onClick={() => setShowEdit(false)} className="text-gray-500">Close</button>
              </div>
              <div className="p-4">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) return alert('Not authenticated');
                    const payload = {
                      title: titleInput,
                      description: descInput,
                      type: typeInput,
                      points: Number(pointsInput) || 0,
                      boardId: boardIdInput || null,
                      columnId: columnIdInput || null,
                    };
                    await axios.patch(`http://localhost:5000/api/projects/${selectedProjectId}/workitems/${editingItemId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                    alert('Updated');
                    setShowEdit(false);
                    setWorkItems(workItems.map(w => w._id === editingItemId ? { ...w, ...payload } : w));
                  } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data?.message || err?.message || 'Failed to update work item';
                    alert(msg);
                  }
                }}>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea value={descInput} onChange={(e) => setDescInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <input value={typeInput} onChange={(e) => setTypeInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Points</label>
                        <input value={pointsInput} onChange={(e) => setPointsInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Board</label>
                        <select value={boardIdInput} onChange={(e) => {
                            const bid = e.target.value;
                            setBoardIdInput(bid);
                            const b = boards.find(x => (x._id === bid));
                            setColumns(b?.columns || []);
                          }} className="w-full px-3 py-2 border rounded">
                          <option value="">(none)</option>
                          {boards.map(b => (
                            <option key={b._id} value={b._id}>{b.name || b._id}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Column</label>
                      <select value={columnIdInput} onChange={(e) => setColumnIdInput(e.target.value)} className="w-full px-3 py-2 border rounded">
                        <option value="">(none)</option>
                        {columns.map(c => (
                          <option key={c._id} value={c._id}>{c.name || c._id}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 rounded border">Cancel</button>
                      <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Update</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Create Sprint Modal */}
        {showSprintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowSprintModal(false)} />
            <div className="bg-white rounded-lg shadow-lg z-60 w-full max-w-md mx-4">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Create Sprint</h3>
                <button onClick={() => setShowSprintModal(false)} className="text-gray-500">Close</button>
              </div>
              <form onSubmit={handleCreateSprint} className="p-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Sprint Name</label>
                    <input 
                      type="text"
                      value={sprintName} 
                      onChange={(e) => setSprintName(e.target.value)} 
                      className="w-full px-3 py-2 border rounded" 
                      placeholder="e.g., Sprint 1"
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Goal</label>
                    <textarea 
                      value={sprintGoal} 
                      onChange={(e) => setSprintGoal(e.target.value)} 
                      className="w-full px-3 py-2 border rounded" 
                      placeholder="What is the goal of this sprint?"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <input 
                      type="date" 
                      value={sprintStartDate} 
                      onChange={(e) => setSprintStartDate(e.target.value)} 
                      className="w-full px-3 py-2 border rounded"
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <input 
                      type="date" 
                      value={sprintEndDate} 
                      onChange={(e) => setSprintEndDate(e.target.value)} 
                      className="w-full px-3 py-2 border rounded"
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">State</label>
                    <select 
                      value={sprintState} 
                      onChange={(e) => setSprintState(e.target.value)} 
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="planned">Planned</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowSprintModal(false)} className="px-4 py-2 rounded border">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create Sprint</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Right rail: make full height and scrollable - this creates the visible scrollbar at the far right */}
        <aside className="w-80 bg-white border-l border-gray-200 px-6 py-6 h-full overflow-y-scroll">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Planning</h3>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-gray-50"><span className="material-symbols-outlined">unfold_less</span></button>
              <button className="p-1 rounded hover:bg-gray-50"><span className="material-symbols-outlined">more_horiz</span></button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <div className="font-medium">Stories</div>
            <div className="text-xs text-gray-400">Drag and drop work items to include them in a sprint.</div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-green-600">calendar_today</span>
                  <div className="text-sm font-medium">{projectName} Team backlog</div>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Active</span>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center text-xs text-gray-500">Some work scheduled. Drag more here.</div>
            </div>

            <div className="border border-gray-200 rounded p-3">
              <div className="text-sm font-medium mb-1">November Week 3</div>
              <div className="text-xs text-gray-400 mb-2">17-11-2025 - 20-11-2025</div>
              <div className="bg-gray-50 p-4 rounded text-center text-xs text-gray-500">No work scheduled yet.</div>
            </div>

            <div className="border border-gray-200 rounded p-3">
              <div className="text-sm font-medium mb-1">November Week 4</div>
              <div className="text-xs text-gray-400 mb-2">24-11-2025 - 28-11-2025</div>
              <div className="bg-gray-50 p-4 rounded text-center text-xs text-gray-500">No work scheduled yet.</div>
            </div>

            <div className="border border-gray-200 rounded p-3">
              <div className="text-sm font-medium mb-1">December Week 1</div>
              <div className="text-xs text-gray-400 mb-2">01-12-2025 - 05-12-2025</div>
              <div className="bg-gray-50 p-4 rounded text-center text-xs text-gray-500">No work scheduled yet.</div>
            </div>

            {/* extra spacer so right rail becomes scrollable like your screenshot */}
            <div className="h-40" />
          </div>
        </aside>
      </div>
    </div>
  );
}

