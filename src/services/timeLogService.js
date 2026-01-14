import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchTimeLogSummary = async (projectId, filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(
      `${API_BASE}/projects/${projectId}/timelogs${params ? '?' + params : ''}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch time log summary:', error);
    throw error;
  }
};

export const updateTimeSpent = async (projectId, workItemId, timeSpent) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(
      `${API_BASE}/projects/${projectId}/workitems/${workItemId}`,
      { timeSpent },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update time spent:', error);
    throw error;
  }
};

// Helper function to format hours to HH:MM
export const formatHours = (hours) => {
  if (!hours || hours === 0) return '0:00';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m.toString().padStart(2, '0')}`;
};

// Helper function to calculate total hours from logs
export const calculateTotalHours = (logs) => {
  return logs.reduce((sum, log) => sum + (log.timeSpent || 0), 0);
};

// Helper function to group logs by user and date
export const groupLogsByUserAndDate = (logs) => {
  const grouped = {};
  logs.forEach(log => {
    const user = log.user || 'Unassigned';
    const date = log.date || new Date().toISOString().split('T')[0];
    
    if (!grouped[user]) {
      grouped[user] = {};
    }
    if (!grouped[user][date]) {
      grouped[user][date] = [];
    }
    grouped[user][date].push(log);
  });
  return grouped;
};

// Helper to get date range for a week
export const getWeekDateRange = (weekType) => {
  const today = new Date();
  let startDate, endDate;
  
  if (weekType === 'current') {
    const day = today.getDay();
    startDate = new Date(today);
    startDate.setDate(today.getDate() - day);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  } else if (weekType === 'last') {
    const day = today.getDay();
    startDate = new Date(today);
    startDate.setDate(today.getDate() - day - 7);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  }
  
  return {
    startDate: startDate ? startDate.toISOString().split('T')[0] : null,
    endDate: endDate ? endDate.toISOString().split('T')[0] : null,
  };
};
