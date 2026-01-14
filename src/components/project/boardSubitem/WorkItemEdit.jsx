import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TaskboardSidebar from '../../TaskboardSidebar';
import ProjectName from '../../../components/ProjectName';

export default function WorkItemEdit() {
  const { projectId, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [workItem, setWorkItem] = useState(null);
  const [timeSpent, setTimeSpent] = useState('');
  // timer session state (seconds)
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const timerStartTimeRef = useRef(null);
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If caller passed the workItem via location.state, use it immediately to avoid an extra fetch
    const stateItem = location?.state?.workItem;
    if (stateItem && (stateItem._id === id || stateItem.id === id)) {
      setWorkItem(stateItem);
      setTimeSpent(stateItem.timeSpent !== undefined && stateItem.timeSpent !== null ? String(stateItem.timeSpent) : '0');
      setStatus(stateItem.state || 'New');
      setDescription(stateItem.description || '');
      setReason(stateItem.reason || '');
      const storedTimerState = sessionStorage.getItem(`timer_${id}`);
      if (storedTimerState) {
        const { startTime, isRunning: wasRunning } = JSON.parse(storedTimerState);
        timerStartTimeRef.current = startTime;
        if (wasRunning) setIsRunning(true);
      } else {
        setSessionSeconds(0);
        setIsRunning(false);
      }
      setLoading(false);
      return;
    }

    const fetchWorkItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/workitems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const item = res.data.item;
        setWorkItem(item);
        setTimeSpent(item.timeSpent !== undefined && item.timeSpent !== null ? String(item.timeSpent) : '0');
        setStatus(item.state || 'New');
        setDescription(item.description || '');
        setReason(item.reason || '');

        const storedTimerState = sessionStorage.getItem(`timer_${id}`);
        if (storedTimerState) {
          const { startTime, isRunning: wasRunning } = JSON.parse(storedTimerState);
          timerStartTimeRef.current = startTime;
          if (wasRunning) setIsRunning(true);
        } else {
          setSessionSeconds(0);
          setIsRunning(false);
        }
      } catch (err) {
        setError('Failed to load work item');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkItem();
  }, [projectId, id, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // include any running/accumulated session seconds into timeSpent (hours)
      const base = parseFloat(timeSpent) || 0;
      const sessionHours = (sessionSeconds || 0) / 3600;
      const payload = { timeSpent: Number((base + sessionHours).toFixed(4)), state: status, description, reason: status !== 'Completed' ? reason : '' };
      await axios.patch(`http://localhost:5000/api/projects/${projectId}/workitems/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1); // Go back
    } catch (err) {
      setError('Failed to update work item');
    }
  };

  // Timer helpers
  useEffect(() => {
    if (isRunning) {
      // calculate elapsed time from start time
      const updateElapsed = () => {
        if (timerStartTimeRef.current) {
          const elapsed = Math.floor((Date.now() - timerStartTimeRef.current) / 1000);
          setSessionSeconds(elapsed);
        }
      };
      updateElapsed();
      intervalRef.current = setInterval(updateElapsed, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [isRunning]);

  const startTimer = () => {
    timerStartTimeRef.current = Date.now();
    setIsRunning(true);
    // persist timer state to sessionStorage
    sessionStorage.setItem(`timer_${id}`, JSON.stringify({ startTime: timerStartTimeRef.current, isRunning: true }));
  };
  
  const stopTimer = async () => {
    setIsRunning(false);
    // clear persisted timer state
    sessionStorage.removeItem(`timer_${id}`);
    
    // add session time to base timeSpent and save
    const base = parseFloat(timeSpent) || 0;
    const sessionHours = (sessionSeconds || 0) / 3600;
    const newTotal = Number((base + sessionHours).toFixed(4));
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/projects/${projectId}/workitems/${id}`, 
        { timeSpent: newTotal }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTimeSpent(String(newTotal));
      setSessionSeconds(0);
      timerStartTimeRef.current = null;
    } catch (err) {
      console.error('Failed to save time:', err);
      setError('Failed to save timer session');
    }
  };
  
  const resetTimer = () => { 
    setIsRunning(false); 
    setSessionSeconds(0);
    timerStartTimeRef.current = null;
    sessionStorage.removeItem(`timer_${id}`);
  };

  const formatSeconds = (secs) => {
    const s = Number(secs || 0);
    const hh = Math.floor(s / 3600).toString().padStart(2, '0');
    const mm = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Top Header Bar - Fixed */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-6 py-3 bg-white z-50 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900">TaskEasy</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-700">sanexsolution</a>
            <span className="text-gray-500">/</span>
            <ProjectName className="text-gray-500 hover:text-gray-700" />
            <span className="text-gray-500">/</span>
            <a href="#" className="text-gray-500 hover:text-gray-700">Boards</a>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">Work Items</span>
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
        <TaskboardSidebar />
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Work Item: {workItem?.title}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-4">⏱️ Time Tracking</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-md">
            {/* Timer Display */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-blue-300 shadow-sm">
              <p className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wide">Session Timer</p>
              <div className="px-6 py-4 border-2 border-blue-400 rounded-lg bg-blue-50 text-3xl font-mono font-bold text-blue-900 mb-4 min-w-max">{formatSeconds(sessionSeconds)}</div>
              <div className="flex gap-3 w-full">
                {!isRunning ? (
                  <button type="button" onClick={startTimer} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition shadow-sm">
                    <span className="material-symbols-outlined inline mr-1 text-lg" style={{fontSize: '18px', verticalAlign: 'middle'}}>play_circle</span>Start
                  </button>
                ) : (
                  <button type="button" onClick={stopTimer} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition shadow-sm">
                    <span className="material-symbols-outlined inline mr-1 text-lg" style={{fontSize: '18px', verticalAlign: 'middle'}}>pause_circle</span>Stop
                  </button>
                )}
                <button type="button" onClick={resetTimer} className="flex-1 px-4 py-2.5 border-2 border-gray-400 bg-white text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition shadow-sm">
                  <span className="material-symbols-outlined inline mr-1 text-lg" style={{fontSize: '18px', verticalAlign: 'middle'}}>refresh</span>Reset
                </button>
              </div>
            </div>
            
            {/* Total Time Spent Display */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-orange-300 shadow-sm">
              <p className="text-xs font-semibold text-orange-600 mb-3 uppercase tracking-wide">Total Time Spent</p>
              <div className="flex items-baseline gap-2 mb-4">
                <div className="px-6 py-4 border-2 border-orange-400 rounded-lg bg-orange-50 text-3xl font-mono font-bold text-orange-900">
                  {(parseFloat(timeSpent) + (sessionSeconds / 3600)).toFixed(2)}
                </div>
                <span className="text-xl font-semibold text-orange-900">hrs</span>
              </div>
              <p className="text-xs text-gray-500 italic text-center">Session time will be added when saved</p>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            rows="4"
            placeholder="Describe the work item"
          />
        </div>
        {status !== 'Completed' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason (if not completed)</label>
            <textarea 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              rows="3"
              placeholder="Explain why it's not completed"
            />
          </div>
        )}
        <div className="flex gap-4">
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
          </div>
        </div>
      </div>
    </div>
  );
}