import axios from 'axios';
import projectContext from './projectContext';

const API_BASE = 'http://localhost:5000/api';

function ensureActiveProject(providedId) {
  const active = projectContext.getActiveProjectId();
  if (!active) throw new Error('No active project set');
  if (providedId && providedId !== active) throw new Error('projectId mismatch with active project');
  return active;
}

export const createWorkItem = async (projectId, workItemData) => {
  try {
    const token = localStorage.getItem('token');
    const active = ensureActiveProject(projectId);
    const response = await axios.post(
      `${API_BASE}/projects/${active}/workitems`,
      workItemData,
      {
        headers: { Authorization: `Bearer ${token}`, 'x-project-id': active },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create work item:', error);
    throw error;
  }
};

export const fetchWorkItems = async (projectId, filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(filters).toString();
    const active = ensureActiveProject(projectId);
    const response = await axios.get(
      `${API_BASE}/projects/${active}/workitems${params ? '?' + params : ''}`,
      {
        headers: { Authorization: `Bearer ${token}`, 'x-project-id': active },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch work items:', error);
    throw error;
  }
};

export const updateWorkItem = async (projectId, workItemId, updates) => {
  try {
    const token = localStorage.getItem('token');
    const active = ensureActiveProject(projectId);
    const response = await axios.patch(
      `${API_BASE}/projects/${active}/workitems/${workItemId}`,
      updates,
      {
        headers: { Authorization: `Bearer ${token}`, 'x-project-id': active },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update work item:', error);
    throw error;
  }
};

export const deleteWorkItem = async (projectId, workItemId) => {
  try {
    const token = localStorage.getItem('token');
    const active = ensureActiveProject(projectId);
    const response = await axios.delete(
      `${API_BASE}/projects/${active}/workitems/${workItemId}`,
      {
        headers: { Authorization: `Bearer ${token}`, 'x-project-id': active },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete work item:', error);
    throw error;
  }
};
