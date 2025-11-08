import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/ai';

export const aiService = {
  // Get AI task suggestions
  suggestTasks: async (context: string) => {
    try {
      const response = await axios.post(`${API_BASE}/suggest-tasks`, {
        context,
      });
      return response.data.tasks;
    } catch (error) {
      console.error('AI Suggest Error:', error);
      throw error;
    }
  },

  // Break down complex task
  breakDownTask: async (taskTitle: string) => {
    try {
      const response = await axios.post(`${API_BASE}/break-down-task`, {
        taskTitle,
      });
      return response.data.subtasks;
    } catch (error) {
      console.error('AI Breakdown Error:', error);
      throw error;
    }
  },

  // Auto-categorize task
  categorizeTask: async (title: string, description?: string) => {
    try {
      const response = await axios.post(`${API_BASE}/categorize-task`, {
        title,
        description,
      });
      return response.data.category;
    } catch (error) {
      console.error('AI Categorize Error:', error);
      return 'other';
    }
  },
};