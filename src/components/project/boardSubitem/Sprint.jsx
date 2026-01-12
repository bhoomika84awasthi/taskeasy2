import React, { useState, useEffect } from 'react';
import { Plus, Settings, ChevronDown, ChevronUp, CircleArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TaskboardSidebar from '../../TaskboardSidebar';
import ProjectName from '../../ProjectName';
import { useProject } from '../../../hooks/useProject';
import TimelineVisualization from '../../TimelineVisualization';

export default function Taskboard() {
  const { projectName } = useProject();
  const [activeTab, setActiveTab] = useState('board');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [showWorkItemModal, setShowWorkItemModal] = useState(false);
  const [sprints, setSprints] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [weekFilter, setWeekFilter] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [sprintStartDate, setSprintStartDate] = useState('');
  const [sprintEndDate, setSprintEndDate] = useState('');
  const [sprintState, setSprintState] = useState('planned');
  
  // Work item form states
  const [workItemTitle, setWorkItemTitle] = useState('');
  const [workItemDescription, setWorkItemDescription] = useState('');
  const [workItemType, setWorkItemType] = useState('Task');
  const [workItemPoints, setWorkItemPoints] = useState('0');
  const [workItemSprintId, setWorkItemSprintId] = useState('');
  const [workItemStartDate, setWorkItemStartDate] = useState('');
  const [workItemDueDate, setWorkItemDueDate] = useState('');
  const [expandedSprints, setExpandedSprints] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [refreshWorkItems, setRefreshWorkItems] = useState(0);
  const [assigningWorkItemId, setAssigningWorkItemId] = useState(null);

  const { projectId: activeProjectId } = useProject();

  // Prefer the globally active project; do NOT auto-select the first project from API.
  useEffect(() => {
    if (activeProjectId) setSelectedProjectId(activeProjectId);
  }, [activeProjectId]);

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

  useEffect(() => {
    if (!selectedProjectId) {
      console.log('selectedProjectId not set, skipping work items fetch');
      return;
    }
    const fetchWorkItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = `http://localhost:5000/api/projects/${selectedProjectId}/workitems`;
        console.log('Fetching work items from:', url);
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Work items response:', res.data);
        if (res.data.items && Array.isArray(res.data.items)) {
          console.log('Setting work items:', res.data.items);
          setWorkItems(res.data.items);
        }
      } catch (err) {
        console.error('Failed to fetch work items:', err);
      }
    };
    fetchWorkItems();
  }, [selectedProjectId, refreshWorkItems]);

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const filterSprintsByWeek = () => {
    let filtered = sprints;

    // Apply week filter
    if (weekFilter !== "all") {
      const currentDate = new Date();
      const currentWeek = getWeekNumber(currentDate);
      const currentYear = currentDate.getFullYear();
      
      filtered = filtered.filter(sprint => {
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
    }

    // Apply date range filter
    if (dateFilter.start || dateFilter.end) {
      const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
      const endDate = dateFilter.end ? new Date(dateFilter.end) : null;

      filtered = filtered.filter(sprint => {
        const sprintStart = new Date(sprint.startDate);
        const sprintEnd = new Date(sprint.endDate);

        if (startDate && sprintEnd < startDate) return false;
        if (endDate && sprintStart > endDate) return false;

        return true;
      });
    }

    return filtered;
  };

  const getSavedSprintsByStatus = () => {
    const filtered = filterSprintsByWeek();
    return {
      new: filtered.filter(s => s.state === "planned"),
      active: filtered.filter(s => s.state === "active"),
      resolved: filtered.filter(s => s.state === "completed"),
    };
  };

  const toggleSprintExpand = (sprintId) => {
    setExpandedSprints(prev => ({
      ...prev,
      [sprintId]: !prev[sprintId]
    }));
  };

  const getWorkItemsForSprint = (sprintId) => {
    console.log('Getting work items for sprint:', sprintId);
    console.log('All workItems:', workItems);
    const result = workItems.filter(w => {
      // Handle case where sprintId is populated as an object with _id property
      const itemSprintId = w.sprintId?._id ? String(w.sprintId._id) : String(w.sprintId);
      const compareSprintId = String(sprintId);
      console.log('Comparing itemSprintId:', itemSprintId, 'with compareSprintId:', compareSprintId, ':', itemSprintId === compareSprintId);
      return itemSprintId === compareSprintId;
    });
    console.log('Filtered result:', result);
    return result;
  };

  const getUnassignedWorkItems = () => {
    console.log('Getting unassigned work items');
    const unassigned = workItems.filter(w => {
      // Handle both object and string/null cases
      const sprintId = w.sprintId?._id ? String(w.sprintId._id) : String(w.sprintId);
      return !w.sprintId || sprintId === 'null' || sprintId === 'undefined';
    });
    console.log('Unassigned items:', unassigned);
    return unassigned;
  };

  const handleAssignWorkItemToSprint = async (workItemId, sprintId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Not authenticated');

      const res = await axios.patch(
        `http://localhost:5000/api/projects/${selectedProjectId}/workitems/${workItemId}`,
        { sprintId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.item) {
        alert('Work item assigned to sprint!');
        setAssigningWorkItemId(null);
        setRefreshWorkItems(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to assign work item:', err);
      alert('Failed to assign work item');
    }
  };

  const handleDeleteWorkItem = async (workItemId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this work item? This action cannot be undone.')) {
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) return alert('Not authenticated');

      const response = await axios.delete(
        `http://localhost:5000/api/projects/${selectedProjectId}/workitems/${workItemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        alert('Work item deleted successfully!');
        setRefreshWorkItems(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to delete work item:', err);
      alert('Failed to delete work item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateWorkItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Not authenticated');
      if (!selectedProjectId) return alert('Please select a project first');
      if (!workItemTitle.trim()) return alert('Please enter a work item title');

      const payload = {
        title: workItemTitle,
        description: workItemDescription,
        type: workItemType,
        points: parseInt(workItemPoints) || 0,
        state: 'New',
        sprintId: workItemSprintId || null,
        timeline: {
          startDate: workItemStartDate ? new Date(workItemStartDate) : null,
          dueDate: workItemDueDate ? new Date(workItemDueDate) : null,
          events: [],
        },
      };

      console.log('Creating work item with payload:', payload);
      console.log('workItemSprintId value:', workItemSprintId);

      const res = await axios.post(
        `http://localhost:5000/api/projects/${selectedProjectId}/workitems`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.item) {
        alert('Work item created successfully!');
        setShowWorkItemModal(false);
        setWorkItemTitle('');
        setWorkItemDescription('');
        setWorkItemType('Task');
        setWorkItemPoints('0');
        setWorkItemSprintId('');
        setWorkItemStartDate('');
        setWorkItemDueDate('');
        // Refresh work items from database
        setRefreshWorkItems(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to create work item';
      alert(msg);
    }
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

  return (
    <div className="flex flex-col h-screen">
      {/* Top Header Bar - Fixed */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-6 py-3 bg-white z-50 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900">TaskEasy</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to="/api/projects" className="text-gray-500 hover:text-gray-700">sanexsolution</Link>
            <span className="text-gray-500">/</span>
              <ProjectName className="text-gray-500 hover:text-gray-700" />
            <span className="text-gray-500">/</span>
            <Link to="/Board" className="text-gray-500 hover:text-gray-700">Boards</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">Sprints</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <label className="flex min-w-40 h-10 max-w-64">
            <div className="flex w-full rounded-lg bg-gray-100 items-center px-2">
              <span className="material-symbols-outlined text-xl text-gray-500">search</span>
              <input
                className="w-full bg-gray-100 outline-none border-none px-2 text-sm"
                placeholder="Search"
              />
            </div>
          </label>

          {/* Avatar */}
          <div
            className="size-10 rounded-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRUkCZdpqZRL5MXrRrz1RX7EoYUpdx-HNqqU53hgxVmkXdWPV8ussiwVxxMgUs8y0TKuZ-E6chVUWfhuutihrI5nuMU-NJi3PDnsv_7UcweWeaVDRzeVlMeIBtxJJkBcdJgbM4f8eI7BHZ0YRoszul4XX5vivJqIMHkWEjUoROqt5QVr3s0_zz_RstNYnDFLtgEe_JUEAW1LJXM3CIlEt82HRw_vF9qGSfpo8H5KKSO65t2T9nTM5WIpdAuPEsK6lPXpe2Q_T3Xr8')"
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pt-16">
      {/* Sidebar Navigation */}
      <TaskboardSidebar projectName={projectName} />
      
      {/* Main Content Area */}
      <div className="flex flex-col p-8 gap-4 w-full h-full overflow-y-auto ml-64">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">{projectName} Team</span>
          <div
            className="cursor-pointer flex items-center gap-1"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-lg cursor-pointer">
          <CircleArrowRight size={20} />
          <span className="text-sm font-medium">View as Backlog</span>
        </div>
      </div>

      {/* Second Line */}
      <div className="flex items-center justify-between">
        <div className="flex gap-6 text-sm">
          <div
            className={`cursor-pointer pb-1 ${
              activeTab === 'board'
                ? 'text-[#0078D4] border-b-2 border-[#0078D4]'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('board')}
          >
            Taskboard
          </div>

          <div
            className={`cursor-pointer pb-1 ${
              activeTab === 'analytics'
                ? 'text-[#0078D4] border-b-2 border-[#0078D4]'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </div>

          <Link
            to="/Sprint"
            className={`cursor-pointer pb-1 text-gray-600 hover:text-[#0078D4]`}
          >
            Backlogs
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowWorkItemModal(true)} className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-700">
            <Plus size={16} /> New Work Item
          </button>
          <button onClick={() => setShowSprintModal(true)} className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Plus size={16} /> Create Sprint
          </button>
          <button className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Settings size={16} /> Column Options
          </button>
        </div>
      </div>

      {/* Filter Section */}
      {filterOpen && (
        <div className="flex gap-4 text-sm mt-2">
          <div className="border rounded-md px-3 py-1 bg-gray-50 cursor-pointer">October week 3</div>
          <div className="border rounded-md px-3 py-1 bg-gray-50 cursor-pointer">Person: All</div>
        </div>
      )}

      {/* Board / Analytics View */}
      <div className="mt-4 bg-gray-50 rounded-lg shadow p-4 min-h-64 overflow-x-auto">
        {activeTab === 'board' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold mb-2">No tasks yet</p>
              <p className="text-sm">Create a new work item to get started</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-4">
            <h2 className="font-semibold">Analytics Section</h2>
            <p className="text-sm text-gray-600 mt-1">This is the analytics view.</p>
          </div>
        )}
      </div>

      {/* Saved Sprints Container */}
      {sprints.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Saved Sprints</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setWeekFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${weekFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                All Weeks
              </button>
              <button
                onClick={() => setWeekFilter("current")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${weekFilter === "current" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                Current Week
              </button>
              <button
                onClick={() => setWeekFilter("upcoming")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${weekFilter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${showDatePicker ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                Date Filter
              </button>
              <button
                onClick={() => setWeekFilter("past")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${weekFilter === "past" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                Past
              </button>
            </div>
          </div>
          {/* Date Filter Picker */}
          {showDatePicker && (
            <div className="mb-6 p-4 bg-white border border-gray-300 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 block mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex gap-2 pt-6">
                  <button 
                    onClick={() => { setDateFilter({ start: '', end: '' }); setShowDatePicker(false); }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => setShowDatePicker(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Unassigned Work Items Section */}
          {getUnassignedWorkItems().length > 0 && (
            <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <h2 className="text-lg font-bold text-yellow-900 mb-4">Unassigned Work Items ({getUnassignedWorkItems().length})</h2>
              <p className="text-sm text-yellow-700 mb-4">Select a sprint below to assign these work items:</p>
              <div className="space-y-3">
                {getUnassignedWorkItems().map(item => (
                  <div key={item._id} className="bg-white px-3 py-3 rounded border border-yellow-200">
                    <Link to={`/workitem/${selectedProjectId}/${item._id}`} className="block">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">{item.title}</span>
                          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 font-semibold">{item.type}</span>
                        </div>
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-600 mb-2">{item.description}</div>
                      )}
                      {item.timeline && (item.timeline.startDate || item.timeline.dueDate) && (
                        <div className="text-xs text-gray-600 mb-2">
                          Timeline: {item.timeline.startDate && new Date(item.timeline.startDate).toLocaleDateString()}
                          {item.timeline.dueDate && ` - ${new Date(item.timeline.dueDate).toLocaleDateString()}`}
                        </div>
                      )}
                    </Link>
                    <div className="flex gap-2">
                      <select 
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignWorkItemToSprint(item._id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="flex-1 px-2 py-1 text-xs border rounded bg-white"
                        defaultValue=""
                      >
                        <option value="">Assign to Sprint...</option>
                        {sprints.map(sprint => (
                          <option key={sprint._id} value={sprint._id}>
                            {sprint.name} ({sprint.state})
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkItem(item._id);
                        }}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 font-medium"
                        title="Delete work item"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Sprints */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">New</h3>
              <div className="space-y-3">
                {getSavedSprintsByStatus().new.length > 0 ? (
                  getSavedSprintsByStatus().new.map(sprint => (
                    <div key={sprint._id} className="border border-gray-300 rounded-lg p-3 bg-white hover:shadow-md transition cursor-pointer" onClick={() => toggleSprintExpand(sprint._id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-800">{sprint.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{sprint.goal}</div>
                          <div className="text-xs mt-2 text-gray-500">
                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                          </div>
                          <span className="inline-block mt-2 px-2 py-1 rounded text-white text-xs font-semibold bg-blue-500">
                            Planned
                          </span>
                        </div>
                        <div className="ml-2">
                          {expandedSprints[sprint._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      {/* Work Items for this Sprint - Collapsible */}
                      {expandedSprints[sprint._id] && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {getWorkItemsForSprint(sprint._id).length > 0 ? (
                            <div>
                              <div className="text-xs font-semibold text-gray-700 mb-2">Work Items:</div>
                              <div className="space-y-2">
                                {getWorkItemsForSprint(sprint._id).map(item => (
                                  <div key={item._id} className="text-xs bg-blue-50 px-3 py-3 rounded border border-blue-100">
                                    <Link to={`/workitem/${selectedProjectId}/${item._id}`} className="block">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-700 font-medium flex-1">{item.title}</span>
                                        <span className="px-1.5 py-0.5 text-xs rounded bg-blue-200 text-blue-800 font-semibold flex-shrink-0 ml-2">{item.type}</span>
                                      </div>
                                      {item.description && (
                                        <div className="text-gray-600 mb-2 text-xs">{item.description}</div>
                                      )}
                                      {item.timeline && (item.timeline.startDate || item.timeline.dueDate) ? (
                                        <div className="mt-2 pt-2 border-t border-blue-200">
                                          <TimelineVisualization timeline={item.timeline} state={item.state} />
                                        </div>
                                      ) : (
                                        item.timeline && (
                                          <div className="mt-2 pt-2 border-t border-blue-200">
                                            <div className="text-xs text-gray-500">No timeline set</div>
                                          </div>
                                        )
                                      )}
                                    </Link>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteWorkItem(item._id);
                                      }}
                                      className="mt-2 w-full px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 font-medium"
                                      title="Delete work item"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic">No work items in this sprint</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No sprints planned</p>
                )}
              </div>
            </div>

            {/* Active Sprints */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Active</h3>
              <div className="space-y-3">
                {getSavedSprintsByStatus().active.length > 0 ? (
                  getSavedSprintsByStatus().active.map(sprint => (
                    <div key={sprint._id} className="border border-gray-300 rounded-lg p-3 bg-white hover:shadow-md transition cursor-pointer" onClick={() => toggleSprintExpand(sprint._id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-800">{sprint.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{sprint.goal}</div>
                          <div className="text-xs mt-2 text-gray-500">
                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                          </div>
                          <span className="inline-block mt-2 px-2 py-1 rounded text-white text-xs font-semibold bg-green-500">
                            Active
                          </span>
                        </div>
                        <div className="ml-2">
                          {expandedSprints[sprint._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      {/* Work Items for this Sprint - Collapsible */}
                      {expandedSprints[sprint._id] && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {getWorkItemsForSprint(sprint._id).length > 0 ? (
                            <div>
                              <div className="text-xs font-semibold text-gray-700 mb-2">Work Items:</div>
                              <div className="space-y-2">
                                {getWorkItemsForSprint(sprint._id).map(item => (
                                  <div key={item._id} className="text-xs bg-green-50 px-3 py-3 rounded border border-green-100">
                                    <Link to={`/workitem/${selectedProjectId}/${item._id}`} className="block">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-700 font-medium flex-1">{item.title}</span>
                                        <span className="px-1.5 py-0.5 text-xs rounded bg-green-200 text-green-800 font-semibold flex-shrink-0 ml-2">{item.type}</span>
                                      </div>
                                      {item.description && (
                                        <div className="text-gray-600 mb-2 text-xs">{item.description}</div>
                                      )}
                                      {item.timeline && (item.timeline.startDate || item.timeline.dueDate) ? (
                                        <div className="mt-2 pt-2 border-t border-green-200">
                                          <TimelineVisualization timeline={item.timeline} state={item.state} />
                                        </div>
                                      ) : (
                                        item.timeline && (
                                          <div className="mt-2 pt-2 border-t border-green-200">
                                            <div className="text-xs text-gray-500">No timeline set</div>
                                          </div>
                                        )
                                      )}
                                    </Link>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteWorkItem(item._id);
                                      }}
                                      className="mt-2 w-full px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 font-medium"
                                      title="Delete work item"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic">No work items in this sprint</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No active sprints</p>
                )}
              </div>
            </div>

            {/* Resolved Sprints */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Resolved</h3>
              <div className="space-y-3">
                {getSavedSprintsByStatus().resolved.length > 0 ? (
                  getSavedSprintsByStatus().resolved.map(sprint => (
                    <div key={sprint._id} className="border border-gray-300 rounded-lg p-3 bg-white hover:shadow-md transition cursor-pointer" onClick={() => toggleSprintExpand(sprint._id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-800">{sprint.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{sprint.goal}</div>
                          <div className="text-xs mt-2 text-gray-500">
                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                          </div>
                          <span className="inline-block mt-2 px-2 py-1 rounded text-white text-xs font-semibold bg-gray-500">
                            Completed
                          </span>
                        </div>
                        <div className="ml-2">
                          {expandedSprints[sprint._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      {/* Work Items for this Sprint - Collapsible */}
                      {expandedSprints[sprint._id] && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {getWorkItemsForSprint(sprint._id).length > 0 ? (
                            <div>
                              <div className="text-xs font-semibold text-gray-700 mb-2">Work Items:</div>
                              <div className="space-y-2">
                                {getWorkItemsForSprint(sprint._id).map(item => (
                                  <div key={item._id} className="text-xs bg-gray-100 px-3 py-3 rounded border border-gray-300">
                                    <Link to={`/workitem/${selectedProjectId}/${item._id}`} className="block">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-700 font-medium flex-1">{item.title}</span>
                                        <span className="px-1.5 py-0.5 text-xs rounded bg-gray-300 text-gray-800 font-semibold flex-shrink-0 ml-2">{item.type}</span>
                                      </div>
                                      {item.description && (
                                        <div className="text-gray-600 mb-2 text-xs">{item.description}</div>
                                      )}
                                      {item.timeline && (item.timeline.startDate || item.timeline.dueDate) ? (
                                        <div className="mt-2 pt-2 border-t border-gray-300">
                                          <TimelineVisualization timeline={item.timeline} state={item.state} />
                                        </div>
                                      ) : (
                                        item.timeline && (
                                          <div className="mt-2 pt-2 border-t border-gray-300">
                                            <div className="text-xs text-gray-500">No timeline set</div>
                                          </div>
                                        )
                                      )}
                                    </Link>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteWorkItem(item._id);
                                      }}
                                      className="mt-2 w-full px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 font-medium"
                                      title="Delete work item"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic">No work items in this sprint</p>
                          )}
                        </div>
                      )}
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

      {/* Create Work Item Modal */}
      {showWorkItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowWorkItemModal(false)} />
          <div className="bg-white rounded-lg shadow-lg z-60 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">Create Work Item</h3>
              <button onClick={() => setShowWorkItemModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleCreateWorkItem} className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input 
                    type="text"
                    value={workItemTitle} 
                    onChange={(e) => setWorkItemTitle(e.target.value)} 
                    className="w-full px-3 py-2 border rounded" 
                    placeholder="e.g., Fix login bug"
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    value={workItemDescription} 
                    onChange={(e) => setWorkItemDescription(e.target.value)} 
                    className="w-full px-3 py-2 border rounded" 
                    placeholder="Describe the work item"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select 
                    value={workItemType} 
                    onChange={(e) => setWorkItemType(e.target.value)} 
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Task">Task</option>
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature</option>
                    <option value="Epic">Epic</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sprint</label>
                  <select 
                    value={workItemSprintId} 
                    onChange={(e) => setWorkItemSprintId(e.target.value)} 
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select a sprint (optional)</option>
                    {sprints.map(sprint => (
                      <option key={sprint._id} value={sprint._id}>
                        {sprint.name} ({sprint.state})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <input 
                    type="number"
                    value={workItemPoints} 
                    onChange={(e) => setWorkItemPoints(e.target.value)} 
                    className="w-full px-3 py-2 border rounded" 
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* Timeline Section */}
                <div className="border-t pt-3 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h4>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <input 
                      type="date"
                      value={workItemStartDate} 
                      onChange={(e) => setWorkItemStartDate(e.target.value)} 
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <input 
                      type="date"
                      value={workItemDueDate} 
                      onChange={(e) => setWorkItemDueDate(e.target.value)} 
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  {/* Timeline Preview */}
                  {(workItemStartDate || workItemDueDate) && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Timeline Preview</h5>
                      <TimelineVisualization 
                        timeline={{
                          startDate: workItemStartDate ? new Date(workItemStartDate) : null,
                          dueDate: workItemDueDate ? new Date(workItemDueDate) : null,
                          completedDate: null,
                          events: []
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowWorkItemModal(false)} className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create Work Item</button>
                </div>
              </div>
            </form>
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
              <button onClick={() => setShowSprintModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleCreateSprint} className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Sprint Name</label>
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
                  <label className="text-sm font-medium text-gray-700">Goal</label>
                  <textarea 
                    value={sprintGoal} 
                    onChange={(e) => setSprintGoal(e.target.value)} 
                    className="w-full px-3 py-2 border rounded" 
                    placeholder="What is the goal of this sprint?"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <input 
                    type="date" 
                    value={sprintStartDate} 
                    onChange={(e) => setSprintStartDate(e.target.value)} 
                    className="w-full px-3 py-2 border rounded"
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <input 
                    type="date" 
                    value={sprintEndDate} 
                    onChange={(e) => setSprintEndDate(e.target.value)} 
                    className="w-full px-3 py-2 border rounded"
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
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
                  <button type="button" onClick={() => setShowSprintModal(false)} className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create Sprint</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}
