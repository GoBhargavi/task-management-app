import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const taskService = {
  // Get all tasks
  getTasks: async (params?: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axios.get(`${API_BASE}/tasks`, {
      headers: getAuthHeader(),
      params,
    });
    return response.data;
  },

  // Get single task
  getTask: async (id: string) => {
    const response = await axios.get(`${API_BASE}/tasks/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Create task
  createTask: async (task: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
  }) => {
    const response = await axios.post(`${API_BASE}/tasks`, task, {
      headers: getAuthHeader(),
    });
    return response.data.task;
  },

  // Update task
  updateTask: async (
    id: string,
    task: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      category?: string;
      dueDate?: string;
    }
  ) => {
    const response = await axios.put(`${API_BASE}/tasks/${id}`, task, {
      headers: getAuthHeader(),
    });
    return response.data.task;
  },

  // Delete task
  deleteTask: async (id: string) => {
    const response = await axios.delete(`${API_BASE}/tasks/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await axios.get(`${API_BASE}/tasks/stats/dashboard`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
