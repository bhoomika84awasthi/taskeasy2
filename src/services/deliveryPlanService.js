import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const deliveryPlanService = {
  // Get all delivery plans for a project
  getAllPlans: async (projectId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/${projectId}/delivery-plans`,
        { headers: getAuthHeader() }
      );
      return response.data.plans;
    } catch (error) {
      console.error('Error fetching delivery plans:', error);
      throw error;
    }
  },

  // Get single delivery plan
  getPlan: async (projectId, planId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/${projectId}/delivery-plans/${planId}`,
        { headers: getAuthHeader() }
      );
      return response.data.plan;
    } catch (error) {
      console.error('Error fetching delivery plan:', error);
      throw error;
    }
  },

  // Create a new delivery plan
  createPlan: async (projectId, planData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/projects/${projectId}/delivery-plans`,
        planData,
        { headers: getAuthHeader() }
      );
      return response.data.plan;
    } catch (error) {
      console.error('Error creating delivery plan:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Update delivery plan
  updatePlan: async (projectId, planId, planData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/projects/${projectId}/delivery-plans/${planId}`,
        planData,
        { headers: getAuthHeader() }
      );
      return response.data.plan;
    } catch (error) {
      console.error('Error updating delivery plan:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Delete delivery plan
  deletePlan: async (projectId, planId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/projects/${projectId}/delivery-plans/${planId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting delivery plan:', error);
      throw error;
    }
  },
};
