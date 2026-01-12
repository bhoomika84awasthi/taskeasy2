import React, { useState, useEffect } from "react";
import { useProject } from '../hooks/useProject';
import { useLocation, Link } from 'react-router-dom';
import ProjectName from '../components/ProjectName';
import TaskboardSidebar from "../components/TaskboardSidebar";
import axios from 'axios';

/**
 * Time Log Summary page component.
 * Displays time log summaries from database.
 * Fetches time log data from the backend API endpoint.
 */

export default function App() {
  const location = useLocation();
  const { projectName, projectId } = useProject();
  const [timeLogs, setTimeLogs] = useState([]);
  const [allWorkItems, setAllWorkItems] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [sprintTotals, setSprintTotals] = useState({});
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [weekSelection, setWeekSelection] = useState('');
  const [monthSelection, setMonthSelection] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Fetch time log data from backend API (robust projectId handling + sprint totals)
  const fetchTimeLogData = async (pId, startDate, endDate) => {
    try {
      setLoading(true);
      setError('');

      if (!pId) {
        console.warn('No projectId available');
        setError('Project ID not available');
        setLoading(false);
        return;
      }

      // Normalize projectId (string, JSON string or stored project object)
      let trimmedPId = String(pId).trim();
      try {
        if ((trimmedPId.startsWith('{') || trimmedPId.startsWith('"')) && !/^[0-9a-fA-F]{24}$/.test(trimmedPId)) {
          const parsed = JSON.parse(trimmedPId);
          trimmedPId = parsed._id || parsed.id || trimmedPId;
        }
      } catch (e) {
        // ignore
      }

      // fallback to common storage keys
      if (!/^[0-9a-fA-F]{24}$/.test(trimmedPId)) {
        const storedId = localStorage.getItem('currentProjectId');
        if (storedId && /^[0-9a-fA-F]{24}$/.test(storedId)) trimmedPId = storedId;
        else {
          const storedProj = localStorage.getItem('currentProject') || localStorage.getItem('project');
          try {
            const sp = storedProj ? JSON.parse(storedProj) : null;
            if (sp && (sp._id || sp.id)) trimmedPId = sp._id || sp.id;
          } catch (e) {
            // ignore
          }
        }
      }

      console.log('Fetching time log summary for projectId:', trimmedPId, 'from:', startDate, 'to:', endDate);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const url = `http://localhost:5000/api/projects/${encodeURIComponent(trimmedPId)}/time-log-summary?fromDate=${encodeURIComponent(startDate)}&toDate=${encodeURIComponent(endDate)}`;
      console.log('API URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetched time log summary:', response.data);

      // normalize response shape - handle various API response formats
      const resp = response.data || {};
      let timeLogsData = resp.timeLogs || resp.timeLogsData || {};
      const items = resp.items || resp.workItems || resp.data || [];

      // If timeLogsData is empty, try to structure it from the response
      if (typeof timeLogsData === 'object' && Object.keys(timeLogsData).length === 0 && items.length > 0) {
        console.log('timeLogsData was empty, attempting to use items instead');
        timeLogsData = items;
      }

      console.log('Parsed response:', { timeLogsData, items, hasTimeLogs: Object.keys(timeLogsData).length > 0 });

      // Store all items for reference
      setAllWorkItems(items);

      // Extract unique users and teams from time logs
      const uniqueUsers = new Set();
      const uniqueTeams = new Set();

      if (timeLogsData && typeof timeLogsData === 'object') {
        const keysInLogs = Object.keys(timeLogsData);
        console.log('Keys to process:', keysInLogs);
        keysInLogs.forEach(user => {
          // Only add if it looks like a user name (not metadata)
          if (user !== 'timeLogs' && user !== 'timeLogsData' && user !== 'items' && user !== 'workItems' && typeof timeLogsData[user] === 'object') {
            uniqueUsers.add(user);
          }
        });
      }

      const usersArray = Array.from(uniqueUsers).sort();
      console.log('Extracted users from time logs:', usersArray);

      setUsers(usersArray);
      setTeams(Array.from(uniqueTeams).sort());

      // Convert grouped time logs to flat array for display
      const flatTimeLogs = convertTimeLogsToArray(timeLogsData);
      console.log('Converted time logs to array, count:', flatTimeLogs.length);

      setTimeLogs(flatTimeLogs);

      if (flatTimeLogs.length === 0) {
        // If API returned no grouped time logs, attempt fallback: fetch workitems and derive time logs
        console.warn('No grouped time logs returned; attempting fallback to workitems endpoint');
        await fallbackFetchWorkItems(trimmedPId, startDate, endDate, token);
      } else {
        setError('');
      }

      // Fetch sprints and compute totals per sprint
      try {
        const sprintsResp = await axios.get(`http://localhost:5000/api/projects/${encodeURIComponent(trimmedPId)}/sprints`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const projectSprints = sprintsResp.data?.sprints || [];
        setSprints(projectSprints);

        const totals = {};
        flatTimeLogs.forEach(log => {
          const name = log.sprintName || 'Unplanned';
          totals[name] = (totals[name] || 0) + hoursToMinutes(log.timeSpent);
        });
        projectSprints.forEach(s => { totals[s.name] = totals[s.name] || 0; });
        setSprintTotals(totals);
      } catch (e) {
        console.warn('Failed to fetch sprints or compute totals', e?.message || e);
        setSprints([]);
        setSprintTotals({});
      }

    } catch (err) {
      console.error('Error fetching time log data:', err);
      setError(`Failed to load time logs: ${err.response?.data?.message || err.message}`);
      setAllWorkItems([]);
      setUsers([]);
      setTimeLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize date range and load data on mount
  useEffect(() => {
    const today = new Date();
    const lastMonthStart = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days back
    const fromDateStr = lastMonthStart.toISOString().split('T')[0];
    const toDateStr = new Date().toISOString().split('T')[0];
    setFromDate(fromDateStr);
    setToDate(toDateStr);

    const urlParams = new URLSearchParams(location.search);
    const urlProjectId = urlParams.get('projectId');
    // Prefer explicit query param first, then projectId from hook, then fallback to localStorage
    // Normalize candidates to ensure we pass a valid 24-hex project id to the API
    const candidates = [urlProjectId, projectId, localStorage.getItem('currentProjectId'), localStorage.getItem('selectedProjectId')];
    let chosenId = null;
    for (const c of candidates) {
      if (!c) continue;
      try {
        const s = String(c).trim();
        if (/^[0-9a-fA-F]{24}$/.test(s)) { chosenId = s; break; }
        if (s.startsWith('{') || s.startsWith('"')) {
          const parsed = JSON.parse(s);
          const id = parsed && (parsed._id || parsed.id);
          if (id && /^[0-9a-fA-F]{24}$/.test(String(id))) { chosenId = String(id); break; }
        }
      } catch (e) { /* ignore malformed */ }
    }

    if (chosenId) {
      fetchTimeLogData(chosenId, fromDateStr, toDateStr);
    } else {
      setError('Project ID not available. Please navigate from a project.');
    }
  }, [projectId, location.search]);

  // Fallback: fetch workitems and convert to time logs when time-log-summary is empty
  const fallbackFetchWorkItems = async (pId, startDate, endDate, token) => {
    try {
      const wiUrl = `http://localhost:5000/api/projects/${encodeURIComponent(pId)}/workitems?limit=1000`;
      console.log('Fallback fetching workitems from', wiUrl);
      const resp = await axios.get(wiUrl, { headers: { Authorization: `Bearer ${token}` } });
      const items = resp.data?.items || resp.data || [];
      console.log('Fallback got items:', items.length);

      setAllWorkItems(items);

      // Filter by date range and convert
      const filtered = filterAndCalculateLogsWithDates(items, startDate, endDate);
      setTimeLogs(filtered);

      // derive users
      const usersSet = new Set();
      filtered.forEach(l => usersSet.add(l.user));
      setUsers(Array.from(usersSet).sort());

      // compute sprint totals
      try {
        const sprintsResp = await axios.get(`http://localhost:5000/api/projects/${encodeURIComponent(pId)}/sprints`, { headers: { Authorization: `Bearer ${token}` } });
        const projectSprints = sprintsResp.data?.sprints || [];
        setSprints(projectSprints);
        const totals = {};
        filtered.forEach(log => { const name = log.sprintName || 'Unplanned'; totals[name] = (totals[name] || 0) + hoursToMinutes(log.timeSpent); });
        projectSprints.forEach(s => { totals[s.name] = totals[s.name] || 0; });
        setSprintTotals(totals);
      } catch (e) {
        console.warn('Fallback: failed to fetch sprints', e?.message || e);
        setSprints([]);
        setSprintTotals({});
      }

      if (filtered.length === 0) setError('No time logs found in this date range');
      else setError('');
    } catch (e) {
      console.error('Fallback fetch failed', e);
      setError('Failed to fetch workitems fallback: ' + (e?.response?.data?.message || e.message));
    }
  };

  // Convert grouped time logs data to flat array
  const convertTimeLogsToArray = (groupedLogs) => {
    const logs = [];
    Object.keys(groupedLogs).forEach(user => {
      const userDates = groupedLogs[user];
      Object.keys(userDates).forEach(date => {
        const itemsForDate = userDates[date];
        itemsForDate.forEach(item => {
          logs.push({
            _id: item._id || `${user}-${date}-${item.title}`,
            title: item.title,
            type: item.type || 'Task',
            timeSpent: item.timeSpent || 0,
            user: user,
            project: projectName,
            startDate: date, // Keep the date string as-is (YYYY-MM-DD format from API)
            sprintName: item.sprintName || 'Unplanned',
          });
        });
      });
    });
    return logs;
  };

  // Filter and calculate logs with date range
  const filterAndCalculateLogsWithDates = (itemsToFilter, startDate, endDate) => {
    console.log('filterAndCalculateLogsWithDates called with:', { itemsToFilter: itemsToFilter.length, startDate, endDate });
    let logs = [];
    
    itemsToFilter.forEach(item => {
      // Get the item's date - could be in various fields
      const itemDateStr = item.timeline?.startDate || item.startDate || item.createdAt || item.addedAt || null;

      console.log('Processing item:', item.title, 'dates:', { timelineStart: item.timeline?.startDate, startDate: item.startDate, createdAt: item.createdAt });
      
      // Filter by date range
      if (itemDateStr) {
        const itemDate = new Date(itemDateStr);
        const filterStartDate = new Date(startDate);
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        
        console.log('Date comparison for', item.title, ':', {
          itemDate: itemDate.toISOString(),
          filterStartDate: filterStartDate.toISOString(),
          filterEndDate: filterEndDate.toISOString(),
          withinRange: itemDate >= filterStartDate && itemDate <= filterEndDate
        });
        
        if (itemDate < filterStartDate || itemDate > filterEndDate) {
          console.log('Item', item.title, 'filtered out - outside date range');
          return;
        }
      } else {
        // No start date - include anyway
        console.log('Item has no start date:', item.title);
      }
      
      // Get user name - handle items with or without assignees
      let userName = 'Unassigned';
      if (item.assignees && Array.isArray(item.assignees) && item.assignees.length > 0) {
        if (typeof item.assignees[0] === 'object' && item.assignees[0].name) {
          userName = item.assignees[0].name;
        } else if (typeof item.assignees[0] === 'string') {
          userName = item.assignees[0];
        }
      }
      
      // Extract date in YYYY-MM-DD format
      let dateString = itemDateStr ? new Date(itemDateStr).toISOString().split('T')[0] : 'Unknown';
      
      // Create log entry
      const logEntry = {
        _id: item._id,
        workItemId: item._id || null,
        title: item.title,
        type: item.type || 'Task',
        timeSpent: parseFloat(item.timeSpent) || 1, // Default to 1 hour if no time spent
        user: userName,
        project: projectName,
        startDate: dateString,
        completedDate: item.timeline?.completedDate,
        sprintName: item.sprint?.name || 'Unplanned',
      };
      console.log('Adding log entry:', logEntry);
      logs.push(logEntry);
    });
    
    console.log('Total logs created:', logs.length);
    return logs;
  };

  // Calculate time logs based on filters
  const calculateTimeLogs = () => {
    let logs = timeLogs; // Start with already fetched logs
    console.log('calculateTimeLogs: timeLogs:', timeLogs.length, 'selectedUser:', selectedUser);
    
    // Filter by user if selected
    if (selectedUser && selectedUser !== '') {
      logs = logs.filter(log => log.user === selectedUser);
    }
    
    // Filter by date range if specified
    if (fromDate) {
      const filterStart = new Date(fromDate);
      logs = logs.filter(log => {
        if (!log.startDate) return true;
        return new Date(log.startDate) >= filterStart;
      });
    }
    
    if (toDate) {
      const filterEnd = new Date(toDate);
      filterEnd.setHours(23, 59, 59, 999);
      logs = logs.filter(log => {
        if (!log.startDate) return true;
        return new Date(log.startDate) <= filterEnd;
      });
    }
    
    console.log('calculateTimeLogs result:', logs.length, 'items');
    return logs;
  };

  // Handle search button
  const handleSearch = () => {
    console.log('Search clicked');
    console.log('Filters - User:', selectedUser, 'From:', fromDate, 'To:', toDate);
    
    // Fetch fresh data from backend
    const urlParams = new URLSearchParams(location.search);
    const urlProjectId = urlParams.get('projectId');
    const pId = projectId || urlProjectId || localStorage.getItem('currentProjectId');
    if (pId) {
      fetchTimeLogData(pId, fromDate, toDate);
    } else {
      setError('Project ID not available');
    }
  };

  // Handle week selection change
  const handleWeekChange = (e) => {
    const week = e.target.value;
    setWeekSelection(week);
    
    if (week === 'current' || week === 'last') {
      const range = getWeekDateRange(week);
      setFromDate(range.startDate);
      setToDate(range.endDate);
      // Auto-fetch with new dates
      const urlParams = new URLSearchParams(location.search);
      const urlProjectId = urlParams.get('projectId');
      const pId = projectId || urlProjectId || localStorage.getItem('currentProjectId');
      if (pId) {
        fetchTimeLogData(pId, range.startDate, range.endDate);
      }
    }
  };

  // Helper function to get week date range
  const getWeekDateRange = (week) => {
    const today = new Date();
    const currentDay = today.getDay();
    
    if (week === 'current') {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - currentDay);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    } else if (week === 'last') {
      const lastWeekEnd = new Date(today);
      lastWeekEnd.setDate(today.getDate() - currentDay - 1);
      lastWeekEnd.setHours(23, 59, 59, 999);
      
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
      lastWeekStart.setHours(0, 0, 0, 0);
      
      return {
        startDate: lastWeekStart.toISOString().split('T')[0],
        endDate: lastWeekEnd.toISOString().split('T')[0]
      };
    }
    return { startDate: '', endDate: '' };
  };

  // Download time logs as CSV
  const handleDownload = () => {
    if (timeLogs.length === 0) {
      alert('No data to download. Please load time logs first.');
      return;
    }

    // Prepare CSV data
    const headers = ['User', 'Project', 'Work Item', 'Type', 'Time Spent (hours)', 'Start Date', 'Sprint'];
    const rows = timeLogs.map(log => [
      log.user,
      log.project,
      log.title,
      log.type,
      log.timeSpent,
      log.startDate ? new Date(log.startDate).toISOString().split('T')[0] : '',
      log.sprintName || 'Unplanned'
    ]);

    // Add summary row (calculate in minutes to avoid float errors, show hours with 2 decimals)
    const totalMinutes = timeLogs.reduce((sum, log) => sum + hoursToMinutes(log.timeSpent), 0);
    const grandTotalHours = (totalMinutes / 60).toFixed(2);
    rows.push(['', '', '', 'TOTAL', grandTotalHours, '', '']);

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => {
          // Escape quotes and wrap in quotes if contains comma
          const cellStr = String(cell);
          return cellStr.includes(',') || cellStr.includes('"') 
            ? `"${cellStr.replace(/"/g, '""')}"` 
            : cellStr;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `Time-Log-Summary-${projectName}-${fromDate}-to-${toDate}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Downloaded:', fileName);
  };

  // Group time logs by week/date
  const getDateColumns = () => {
    const dates = new Set();
    timeLogs.forEach(log => {
      if (log.startDate) {
        // Handle both ISO format and YYYY-MM-DD format
        let dateStr = log.startDate;
        if (dateStr.includes('T')) {
          dateStr = dateStr.split('T')[0];
        }
        dates.add(dateStr);
      }
    });
    return Array.from(dates).sort();
  };

  // Calculate time for a specific user and date
  const getTimeForUserAndDate = (user, date) => {
    const userLogs = timeLogs.filter(l => 
      l.user === user && 
      l.startDate && 
      new Date(l.startDate).toISOString().split('T')[0] === date
    );
    // Sum in whole minutes to avoid floating point rounding errors
    const minutes = userLogs.reduce((sum, l) => {
      const hrs = parseFloat(l.timeSpent) || 0;
      return sum + Math.round(hrs * 60);
    }, 0);
    return minutes; // return minutes
  };

  // Helpers: work with minutes to avoid float precision issues
  const formatMinutes = (minutes) => {
    const mins = Number.isFinite(minutes) ? Math.round(minutes) : 0;
    if (!mins || mins === 0) return '0:00';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  const hoursToMinutes = (hours) => {
    const raw = parseFloat(hours);
    if (!Number.isFinite(raw) || raw === 0) return 0;
    // Some API responses use minutes (e.g. 480) while others use decimal hours (e.g. 8.0)
    // If value looks like minutes (> 24) treat as minutes already, otherwise treat as hours.
    if (raw > 24) {
      return Math.round(raw);
    }
    return Math.round(raw * 60);
  };

  // Get unique users from filtered logs
  const getUsersFromLogs = () => {
    const usersSet = new Set();
    timeLogs.forEach(log => {
      usersSet.add(log.user);
    });
    return Array.from(usersSet).sort();
  };

  // Calculate total for a date
  const getTotalForDate = (date) => {
    const totalMinutes = timeLogs
      .filter(l => {
        if (!l.startDate) return false;
        let logDate = l.startDate;
        if (logDate.includes('T')) {
          logDate = logDate.split('T')[0];
        }
        return logDate === date;
      })
      .reduce((sum, l) => sum + hoursToMinutes(l.timeSpent), 0);
    return formatMinutes(totalMinutes);
  };

  // Calculate grand total
  const getGrandTotal = () => {
    const totalMinutes = timeLogs.reduce((sum, l) => sum + hoursToMinutes(l.timeSpent), 0);
    return formatMinutes(totalMinutes);
  };

  const dateColumns = getDateColumns();
  const logsUsers = getUsersFromLogs();

  // Robust display name: prefer `projectName` from hook, else try localStorage stored project
  const displayProjectName = (() => {
    if (projectName && projectName !== 'Project') return projectName;
    try {
      const raw = localStorage.getItem('currentProject') || localStorage.getItem('project');
      if (!raw) return projectName || 'Project';
      const parsed = JSON.parse(raw);
      return parsed?.name || parsed?.title || String(parsed) || projectName || 'Project';
    } catch (e) {
      // not JSON — maybe simple string
      const raw = localStorage.getItem('currentProject') || localStorage.getItem('project');
      return raw || projectName || 'Project';
    }
  })();

  // Normalize project id: accept plain 24-hex id or JSON string/object containing _id/id
  const normalizeProjectId = (raw) => {
    if (!raw) return null;
    let val = raw;
    // if it's an object already
    if (typeof val === 'object') {
      return (val._id || val.id) || null;
    }
    try {
      // trim
      val = String(val).trim();
      // if looks like a 24-hex mongo id
      if (/^[0-9a-fA-F]{24}$/.test(val)) return val;
      // try parse JSON object
      if ((val.startsWith('{') || val.startsWith('"')) && !/^[0-9a-fA-F]{24}$/.test(val)) {
        const parsed = JSON.parse(val);
        return (parsed && (parsed._id || parsed.id)) || null;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const urlParams = new URLSearchParams(location.search);
  const urlProjectIdParam = urlParams.get('projectId');
  const effectiveProjectId = normalizeProjectId(urlProjectIdParam) || normalizeProjectId(projectId) || normalizeProjectId(localStorage.getItem('currentProjectId')) || normalizeProjectId(localStorage.getItem('selectedProjectId')) || null;

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-40 flex w-full items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#111418] text-2xl">rocket_launch</span>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">TaskEasy</h2>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2" />

          <nav className="flex flex-wrap items-center gap-2">
            <Link className="text-[#617289] text-sm font-medium leading-normal hover:underline" to="/api/projects">sanexsolution</Link>
            <span className="text-[#617289] text-sm font-medium leading-normal">/</span>
            <ProjectName className="text-[#617289] text-sm font-medium leading-normal hover:underline" />
            <span className="text-[#617289] text-sm font-medium leading-normal">/</span>
            <Link className="text-[#617289] text-sm font-medium leading-normal hover:underline" to="/Board">Boards</Link>
            <span className="text-[#617289] text-sm font-medium leading-normal">/</span>
            <span className="text-[#111418] text-sm font-medium leading-normal">Time Log Summary Free</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[#617289] text-sm font-normal leading-normal">Version: 1.0.4.0</p>

          <label className="flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#617289] flex border-none bg-background-light items-center justify-center pl-3 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>

              
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-background-light h-full placeholder:text-[#617289] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search" />
            </div>
          </label>

          <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-background-light text-[#111418]">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-background-light text-[#111418]">
            <span className="material-symbols-outlined">settings</span>
          </button>

          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAJlWbNQrnXaAID5uU9bbl6dm9ht-4VkcEUDb78-4XQvJjRW0UKB0IGWXtQRwsKmt4utDTkHOdUu2YKwZZNmssZimGxglEBI5s2bB9iIY0P7qW1uUEdiN3WV9kXKeZuyB28ZbsD1tG7uFGfBpD94HdiyEruC3gMwQsYf7GnvKd3HILmv9G_P-p_sEX9l4UZo0vA6RDm3ASCbE0ygxOnjA_hMNrqpmKUV4fsunb2BQnMTy0c71HGTvbRR3Lq9KH2yQt-rToqOF0QZc")` }} />
        </div>
      </header>

        {/* LAYOUT */}
      <div className="flex w-full flex-1">

        <TaskboardSidebar projectName={projectName} />

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto bg-white ml-64 mt-16">
          <div className="p-6">
            {/* Notice */}
            <div className="mb-6 @container">
              <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 @[480px]:flex-row @[480px]:items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-yellow-800 text-base font-bold leading-tight">Extension is taking longer than expected</p>
                  <p className="text-yellow-700 text-base font-normal leading-normal">Time Logging Extension is taking longer than expected to load.</p>
                </div>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-blue-600 text-white text-sm font-semibold leading-normal hover:bg-blue-700 shadow-sm">Dismiss</button>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">schedule</span>
                <h1 className="text-2xl font-bold text-[#111418]">Time Log Summary</h1>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {/* Team */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600">groups</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-600">Team</label>
                    <select
                      className="mt-1 w-full rounded-md border-0 bg-transparent text-sm py-2 px-2 focus:outline-none"
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                      <option value="">All teams</option>
                      {teams.map((team, idx) => (
                        <option key={idx} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* User */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600">person</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-600">Team / User</label>
                    <select
                      className="mt-1 w-full rounded-md border-0 bg-transparent text-sm py-2 px-2 focus:outline-none"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    >
                      <option value="">All users</option>
                      {users.map((user, idx) => (
                        <option key={idx} value={user}>{user}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Week */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600">calendar_view_week</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-600">Week</label>
                    <select
                      className="mt-1 w-full rounded-md border-0 bg-transparent text-sm py-2 px-2 focus:outline-none"
                      value={weekSelection}
                      onChange={handleWeekChange}
                    >
                      <option value="">Select Week</option>
                      <option value="current">Current Week</option>
                      <option value="last">Last Week</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>

                {/* Month */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-purple-600">calendar_month</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-600">Month</label>
                    <select
                      className="mt-1 w-full rounded-md border-0 bg-transparent text-sm py-2 px-2 focus:outline-none"
                      value={monthSelection}
                      onChange={(e) => setMonthSelection(e.target.value)}
                    >
                      <option value="">Any month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                </div>

                {/* From Date */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-yellow-600">calendar_today</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-600">From date</label>
                    <div className="mt-1 relative">
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full rounded-md border-0 bg-transparent text-sm py-2 px-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* To Date */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-rose-600">date_range</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-600">To date</label>
                    <div className="mt-1 relative">
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full rounded-md border-0 bg-transparent text-sm py-2 px-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-semibold leading-normal hover:bg-blue-700 shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                  <span>{loading ? 'Loading...' : 'Search'}</span>
                </button>

                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-gray-300 text-gray-800 text-sm font-medium leading-normal hover:bg-gray-400 cursor-pointer">
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Download</span>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Summary Statistics Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {/* Total Hours Logged */}
                <div className="bg-white border-l-4 border-blue-600 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">Total Hours Logged</p>
                      <p className="text-3xl font-bold text-blue-700">{timeLogs.length > 0 ? getGrandTotal() : '0:00'}</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4">
                      <span className="material-symbols-outlined text-3xl text-blue-600">schedule</span>
                    </div>
                  </div>
                </div>

                {/* Number of Users */}
                <div className="bg-white border-l-4 border-green-600 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">Users Logged Time</p>
                      <p className="text-3xl font-bold text-green-700">{logsUsers.length}</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-4">
                      <span className="material-symbols-outlined text-3xl text-green-600">group</span>
                    </div>
                  </div>
                </div>

                {/* Number of Work Items */}
                <div className="bg-white border-l-4 border-purple-600 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">Work Items Tracked</p>
                      <p className="text-3xl font-bold text-purple-700">{timeLogs.length}</p>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-4">
                      <span className="material-symbols-outlined text-3xl text-purple-600">task_alt</span>
                    </div>
                  </div>
                </div>

                {/* Average Hours Per User */}
                <div className="bg-white border-l-4 border-orange-600 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">Avg Hours/User</p>
                      <p className="text-3xl font-bold text-orange-700">{logsUsers.length > 0 ? formatMinutes(Math.round(timeLogs.reduce((sum, l) => sum + hoursToMinutes(l.timeSpent), 0) / logsUsers.length)) : '0:00'}</p>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-4">
                      <span className="material-symbols-outlined text-3xl text-orange-600">trending_up</span>
                    </div>
                  </div>
                </div>
              </div>

              

              {/* Table */}
<div className="overflow-x-auto border border-gray-200 bg-white">
  <table className="w-full border-collapse text-sm">
    {/* ===== HEADER ===== */}
    <thead>
      {/* DATE ROW */}
      <tr className="border-b border-gray-300 bg-gray-50">
        <th className="px-6 py-3 text-left font-semibold text-gray-700">USER</th>
        <th className="px-6 py-3 text-left font-semibold text-gray-700">PROJECT</th>
        <th className="px-6 py-3 text-left font-semibold text-gray-700">WORK ITEM</th>
        <th className="px-6 py-3 text-left font-semibold text-gray-700">TYPE</th>
        

        {dateColumns.map(date => (
          <th
            key={date}
            className="px-4 py-3 text-center font-semibold text-gray-700 border-l border-gray-200"
          >
            {date}
          </th>
        ))}
      </tr>

      {/* DAY ROW */}
      <tr className="border-b border-gray-300 bg-gray-50">
        <th colSpan={5}></th>

        {dateColumns.map(date => (
          <th
            key={`day-${date}`}
            className="px-4 py-2 text-center text-xs font-medium text-gray-600 border-l border-gray-200"
          >
            {new Date(date)
              .toLocaleString("en-US", { weekday: "short" })
              .toUpperCase()}
          </th>
        ))}
      </tr>
    </thead>

    {/* ===== BODY ===== */}
    <tbody>
      {logsUsers.map(user => {
        const userLogs = timeLogs.filter(l => l.user === user);

        return userLogs.map((log, index) => {
          // determine a valid work item id to link to: prefer the explicit `workItemId` captured earlier
          const isValidObjectId = (v) => typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v);
          let targetWorkItemId = null;
          if (isValidObjectId(log.workItemId)) {
            targetWorkItemId = log.workItemId;
          } else if (allWorkItems && Array.isArray(allWorkItems) && allWorkItems.length > 0) {
            const match = allWorkItems.find(it => {
              if (!it) return false;
              if (it._id && isValidObjectId(it._id) && (it._id === log.workItemId || it._id === log._id)) return true;
              // try matching by title + date heuristics
              const itDate = (it.startDate || it.timeline?.startDate || it.createdAt || '').split('T')[0];
              const logDate = (log.startDate || '').split('T')[0];
              if (it.title === log.title && itDate && logDate && itDate === logDate) return true;
              return false;
            });
            if (match && isValidObjectId(match._id)) targetWorkItemId = match._id;
          }

          return (
          <tr key={log._id || index} className="border-b border-gray-200 hover:bg-gray-50">
            {index === 0 && (
              <>
                <td rowSpan={userLogs.length} className="px-6 py-3 font-medium text-gray-900">
                  {user}
                </td>
                <td rowSpan={userLogs.length} className="px-6 py-3 text-gray-700">
                  {log.project}
                </td>
              </>
            )}

            <td className="px-6 py-3 text-blue-600 hover:underline cursor-pointer">
              {targetWorkItemId ? (
                <Link
                  className="text-blue-600 hover:underline"
                  to={{
                    pathname: `/workitem/${encodeURIComponent(effectiveProjectId)}/${encodeURIComponent(targetWorkItemId)}`,
                    state: { workItem: log }
                  }}
                >
                  {log.title}
                </Link>
              ) : (
                <span className="text-gray-700">{log.title}</span>
              )}
            </td>

            <td className="px-6 py-3 text-gray-700">{log.type}</td>

            {dateColumns.map(date => {
              const logDate = log.startDate?.split("T")[0];
              const value =
                logDate === date
                  ? formatMinutes(hoursToMinutes(log.timeSpent))
                  : "—";

              return (
                <td
                  key={date}
                  className="px-4 py-3 text-center text-gray-700 border-l border-gray-200"
                >
                  {value}
                </td>
              );
            })}
          </tr>
        );
      });
    })}
    </tbody>

    {/* ===== FOOTER ===== */}
    <tfoot>
      <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
        <td colSpan={4} className="px-6 py-3 text-right text-gray-900">
          Totals
        </td>

        {dateColumns.map(date => (
          <td
            key={`total-${date}`}
            className="px-4 py-3 text-center text-gray-900 font-semibold border-l border-gray-200"
          >
            {getTotalForDate(date)}
          </td>
        ))}

        <td className="px-4 py-3 text-center text-gray-900 font-bold border-l border-gray-200 bg-gray-100">
          {getGrandTotal()}
        </td>
      </tr>
    </tfoot>
  </table>
</div>


            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
