import React, { useState, useEffect } from "react";
import { useProject } from '../hooks/useProject';
import { deliveryPlanService } from '../services/deliveryPlanService';
import TaskboardSidebar from "../components/TaskboardSidebar";
import ProjectName from '../components/ProjectName';
import { Link } from 'react-router-dom';

export default function DeliveryPage() {
  const { projectName, projectInitial, projectId } = useProject();
  const [plans, setPlans] = useState([]);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [newPlanDeliveryDate, setNewPlanDeliveryDate] = useState('');
  const [newPlanNumSprints, setNewPlanNumSprints] = useState('');
  const [newPlanNumTasks, setNewPlanNumTasks] = useState('');
  const [newPlanIsDelayed, setNewPlanIsDelayed] = useState(false);
  const [newPlanDelayReason, setNewPlanDelayReason] = useState('');
  const [newPlanStatus, setNewPlanStatus] = useState('pending');
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanDescription, setEditPlanDescription] = useState('');
  const [editPlanDeliveryDate, setEditPlanDeliveryDate] = useState('');
  const [editPlanNumSprints, setEditPlanNumSprints] = useState('');
  const [editPlanNumTasks, setEditPlanNumTasks] = useState('');
  const [editPlanIsDelayed, setEditPlanIsDelayed] = useState(false);
  const [editPlanDelayReason, setEditPlanDelayReason] = useState('');
  const [editPlanStatus, setEditPlanStatus] = useState('pending');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const statusLabel = (s) => {
    // Map backend statuses to frontend-friendly statuses and labels
    const backendToFrontendStatus = (val) => {
      if (!val) return 'pending';
      if (val === 'draft') return 'pending';
      if (val === 'completed') return 'delivered';
      return val; // active, delayed, on-hold, etc.
    };

    const f = backendToFrontendStatus(s);
    const map = {
      pending: 'Pending',
      delivered: 'Delivered',
      delayed: 'Delayed',
      active: 'Active',
      completed: 'Completed',
      draft: 'Pending'
    };
    return map[f] || String(f).charAt(0).toUpperCase() + String(f).slice(1);
  };

  // Conversion helpers between frontend and backend status values
  const frontendToBackendStatus = (val) => {
    if (!val) return 'draft';
    if (val === 'pending') return 'draft';
    if (val === 'delivered') return 'completed';
    return val;
  };

  const backendToFrontendStatus = (val) => {
    if (!val) return 'pending';
    if (val === 'draft') return 'pending';
    if (val === 'completed') return 'delivered';
    return val;
  };

  // Fetch delivery plans
  useEffect(() => {
    const storedProjectId = projectId || localStorage.getItem('currentProjectId');
    if (storedProjectId) {
      fetchPlans(storedProjectId);
    } else {
      console.warn('ProjectId not available yet');
    }
  }, [projectId]);

  const fetchPlans = async (pId) => {
    try {
      const data = await deliveryPlanService.getAllPlans(pId);
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleCreatePlan = async () => {
    const storedProjectId = projectId || localStorage.getItem('currentProjectId');
    if (!storedProjectId) {
      alert('Project ID not found. Please ensure you are on a valid project page.');
      return;
    }

    if (!newPlanName.trim()) {
      alert('Please enter a plan name');
      return;
    }

    try {
      const newPlan = await deliveryPlanService.createPlan(storedProjectId, {
        name: newPlanName,
        description: newPlanDescription,
        deliveryDate: newPlanDeliveryDate ? new Date(newPlanDeliveryDate) : null,
        numberOfSprints: newPlanNumSprints ? parseInt(newPlanNumSprints) : 0,
        numberOfTasks: newPlanNumTasks ? parseInt(newPlanNumTasks) : 0,
        isDelayed: newPlanIsDelayed,
        delayReason: newPlanDelayReason || null,
        status: frontendToBackendStatus(newPlanStatus),
      });

      // If backend didn't return status, set it locally so the UI shows chosen status immediately
      if (!newPlan.status) newPlan.status = frontendToBackendStatus(newPlanStatus);

      // Refresh list from backend to ensure consistency
      await fetchPlans(storedProjectId);

      setShowNewPlanModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create plan:', error);
      alert('Failed to create plan: ' + (error.error || error.message || 'Unknown error'));
    }
  };

  const resetForm = () => {
    setNewPlanName('');
    setNewPlanDescription('');
    setNewPlanDeliveryDate('');
    setNewPlanNumSprints('');
    setNewPlanNumTasks('');
    setNewPlanIsDelayed(false);
    setNewPlanDelayReason('');
    setNewPlanStatus('pending');
  };

  const handleDeletePlan = async (planId) => {
    const storedProjectId = projectId || localStorage.getItem('currentProjectId');
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        await deliveryPlanService.deletePlan(storedProjectId, planId);
        setPlans(plans.filter(p => p._id !== planId));
      } catch (error) {
        console.error('Failed to delete plan:', error);
        alert('Failed to delete plan');
      }
    }
  };

  const handleEditClick = (plan) => {
    setEditingPlanId(plan._id);
    setEditPlanName(plan.name);
    setEditPlanDescription(plan.description);
    setEditPlanDeliveryDate(plan.deliveryDate ? plan.deliveryDate.split('T')[0] : '');
    setEditPlanNumSprints(plan.numberOfSprints.toString());
    setEditPlanNumTasks(plan.numberOfTasks.toString());
    setEditPlanIsDelayed(plan.isDelayed);
    setEditPlanDelayReason(plan.delayReason || '');
    // Convert backend status to frontend value (e.g., draft -> pending, completed -> delivered)
    setEditPlanStatus(backendToFrontendStatus(plan.status));
  };

  const handleUpdatePlan = async () => {
    if (!editPlanName.trim()) {
      alert('Please enter a plan name');
      return;
    }

    try {
      const storedProjectId = projectId || localStorage.getItem('currentProjectId');
      if (!storedProjectId) {
        alert('Project ID not found. Please ensure you are on a project page.');
        return;
      }

      await deliveryPlanService.updatePlan(storedProjectId, editingPlanId, {
        name: editPlanName,
        description: editPlanDescription,
        deliveryDate: editPlanDeliveryDate ? new Date(editPlanDeliveryDate) : null,
        numberOfSprints: editPlanNumSprints ? parseInt(editPlanNumSprints) : 0,
        numberOfTasks: editPlanNumTasks ? parseInt(editPlanNumTasks) : 0,
        isDelayed: editPlanIsDelayed,
        delayReason: editPlanDelayReason || null,
        // convert frontend status (pending/delivered) to backend enum (draft/completed)
        status: frontendToBackendStatus(editPlanStatus),
      });

      // Re-fetch plans to ensure UI matches backend
      await fetchPlans(storedProjectId);
      cancelEdit();
    } catch (error) {
      console.error('Failed to update plan:', error);
      alert('Failed to update plan: ' + (error.error || error.message || 'Unknown error'));
    }
  };

  const cancelEdit = () => {
    setEditingPlanId(null);
    setEditPlanName('');
    setEditPlanDescription('');
    setEditPlanDeliveryDate('');
    setEditPlanNumSprints('');
    setEditPlanNumTasks('');
    setEditPlanIsDelayed(false);
    setEditPlanDelayReason('');
    setEditPlanStatus('pending');
  };

  const getFilteredPlans = () => {
    return plans.filter((plan) => {
      // Filter by search term
      const searchMatch = searchTerm === '' || 
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by date range
      let dateMatch = true;
      if (plan.deliveryDate) {
        const planDate = new Date(plan.deliveryDate);
        
        if (filterFromDate) {
          const fromDate = new Date(filterFromDate);
          if (planDate < fromDate) dateMatch = false;
        }
        
        if (filterToDate) {
          const toDate = new Date(filterToDate);
          if (planDate > toDate) dateMatch = false;
        }
      } else {
        // If plan has no delivery date, only show it if no date filters are applied
        if (filterFromDate || filterToDate) dateMatch = false;
      }

      return searchMatch && dateMatch;
    });
  };

  return (
    <div className="flex h-screen bg-[#f6f7f9] text-gray-800">

      <TaskboardSidebar projectName={projectName} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
  {/* Top Navigation */}
  <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-6 py-3 bg-white">
    <div className="flex items-center gap-4 text-gray-600">
      <div className="flex flex-wrap gap-2 text-sm">
          <Link to="/start" className="text-gray-500">sanexsolution</Link>
          <span>/</span>
          <ProjectName className="text-gray-500" />
          <span>/</span>
          <Link to="/Board" className="text-gray-500">Boards</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Delivery Plans</span>
        </div>
    </div>

    <div className="flex items-center gap-4">
      <label className="flex min-w-40 h-10 max-w-64">
        <div className="flex w-full rounded-lg bg-gray-100 items-center px-2">
          <span className="material-symbols-outlined text-xl text-gray-500">search</span>
          <input
            className="w-full bg-gray-100 outline-none border-none px-2 text-sm"
            placeholder="Search"
          />
        </div>
      </label>

      <div
        className="size-10 rounded-full bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRUkCZdpqZRL5MXrRrz1RX7EoYUpdx-HNqqU53hgxVmkXdWPV8ussiwVxxMgUs8y0TKuZ-E6chVUWfhuutihrI5nuMU-NJi3PDnsv_7UcweWeaVDRzeVlMeIBtxJJkBcdJgbM4f8eI7BHZ0YRoszul4XX5vivJqIMHkWEjUoROqt5QVr3s0_zz_RstNYnDFLtgEe_JUEAW1LJXM3CIlEt82HRw_vF9qGSfpo8H5KKSO65t2T9nTM5WIpdAuPEsK6lPXpe2Q_T3Xr8')"
        }}
      />
    </div>
  </header>

  {/* Main Area */}
  <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#f6f7f9]">
    <div className="max-w-7xl mx-auto">
      {!projectId ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            <strong>Note:</strong> Please access this page from a project context.
          </p>
        </div>
      ) : (
        <>
          {/* Heading */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Delivery Plans</h1>
            <button
              onClick={() => setShowNewPlanModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-sm bg-white/20 rounded-full p-1">
                add
              </span>
              New plan
            </button>
          </div>

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Delivery Plans</h2>
            </div>

            {/* Content Area */}
            {plans.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-sm">No delivery plans created yet. Click "New plan" to get started.</p>
              </div>
            ) : (
              <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredPlans().map((plan) => (
                  <div
                    key={plan._id}
                    className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg text-gray-900 truncate">{plan.name}</h3>
                        {plan.isDelayed && (
                          <span className="whitespace-nowrap px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                            DELAYED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      {plan.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {plan.deliveryDate && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500 text-xs mb-1">Delivery Date</p>
                            <p className="font-medium text-gray-900">{new Date(plan.deliveryDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-500 text-xs mb-1">Sprints</p>
                          <p className="font-medium text-gray-900">{plan.numberOfSprints || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-500 text-xs mb-1">Tasks</p>
                          <p className="font-medium text-gray-900">{plan.numberOfTasks || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-500 text-xs mb-1">Status</p>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                            // use frontend-mapped status for display color
                            (function(){
                              const ds = backendToFrontendStatus(plan.status);
                              return ds === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                ds === 'delivered' ? 'bg-green-100 text-green-700' :
                                ds === 'delayed' ? 'bg-red-100 text-red-700' :
                                ds === 'active' ? 'bg-green-100 text-green-700' :
                                ds === 'completed' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700';
                            })()
                          }`}>
                            {statusLabel(plan.status)}
                          </span>
                        </div>
                      </div>

                      {plan.isDelayed && plan.delayReason && (
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <p className="text-xs text-red-700"><strong>Reason:</strong> {plan.delayReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Card Footer - Buttons */}
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={() => handleEditClick(plan)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  </main>
</div>

      {/* New Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-auto my-4 overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Create New Delivery Plan</h2>
            </div>
            
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
                <input
                  type="text"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="Enter plan name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                  placeholder="Enter plan description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    value={newPlanDeliveryDate}
                    onChange={(e) => setNewPlanDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sprints</label>
                  <input
                    type="number"
                    value={newPlanNumSprints}
                    onChange={(e) => setNewPlanNumSprints(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tasks</label>
                  <input
                    type="number"
                    value={newPlanNumTasks}
                    onChange={(e) => setNewPlanNumTasks(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delayed?</label>
                  <select
                    value={newPlanIsDelayed ? 'yes' : 'no'}
                    onChange={(e) => setNewPlanIsDelayed(e.target.value === 'yes')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newPlanStatus}
                    onChange={(e) => setNewPlanStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {newPlanIsDelayed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delay Reason</label>
                  <textarea
                    value={newPlanDelayReason}
                    onChange={(e) => setNewPlanDelayReason(e.target.value)}
                    placeholder="Enter reason for delay"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowNewPlanModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlan}
                disabled={!projectId}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                  projectId 
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {projectId ? 'Create Plan' : 'Loading...'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlanId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-auto my-4 overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Delivery Plan</h2>
              <p className="text-sm text-gray-500 mt-1">Update the delivery plan details</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={editPlanName}
                  onChange={(e) => setEditPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., Q1 Release"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editPlanDescription}
                  onChange={(e) => setEditPlanDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter plan description"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    value={editPlanDeliveryDate}
                    onChange={(e) => setEditPlanDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sprints</label>
                  <input
                    type="number"
                    value={editPlanNumSprints}
                    onChange={(e) => setEditPlanNumSprints(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tasks</label>
                <input
                  type="number"
                  value={editPlanNumTasks}
                  onChange={(e) => setEditPlanNumTasks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delayed?</label>
                <select
                  value={editPlanIsDelayed ? 'yes' : 'no'}
                  onChange={(e) => setEditPlanIsDelayed(e.target.value === 'yes')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editPlanStatus}
                  onChange={(e) => setEditPlanStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {editPlanIsDelayed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delay Reason</label>
                  <textarea
                    value={editPlanDelayReason}
                    onChange={(e) => setEditPlanDelayReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Why is the plan delayed?"
                    rows="2"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePlan}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
  );
}

/* ---- SIDEBAR ITEM COMPONENT ---- */
function SidebarItem({ icon, text }) {
  return (
    <li>
      <a
        className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium text-gray-700 rounded hover:bg-gray-100"
        href="#"
      >
        <span className="material-symbols-outlined text-lg">{icon}</span>
        {text}
      </a>
    </li>
  );
}


