const API_URL = 'http://localhost:5000/api';

const pipelineService = {
  // Create a new pipeline
  async createPipeline(projectId, pipelineData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pipelines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          projectId,
          ...pipelineData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create pipeline');
      }

      const data = await response.json();
      return data.pipeline;
    } catch (error) {
      console.error('Error creating pipeline:', error);
      throw error;
    }
  },

  // Get all pipelines for a project
  async getPipelinesByProject(projectId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pipelines/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pipelines');
      }

      const data = await response.json();
      return data.pipelines;
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      throw error;
    }
  },

  // Get a single pipeline
  async getPipeline(pipelineId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pipelines/detail/${pipelineId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pipeline');
      }

      const data = await response.json();
      return data.pipeline;
    } catch (error) {
      console.error('Error fetching pipeline:', error);
      throw error;
    }
  },

  // Update a pipeline
  async updatePipeline(pipelineId, updateData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pipelines/${pipelineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update pipeline');
      }

      const data = await response.json();
      return data.pipeline;
    } catch (error) {
      console.error('Error updating pipeline:', error);
      throw error;
    }
  },

  // Delete a pipeline
  async deletePipeline(pipelineId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pipelines/${pipelineId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete pipeline');
      }

      return true;
    } catch (error) {
      console.error('Error deleting pipeline:', error);
      throw error;
    }
  },
};

export default pipelineService;
