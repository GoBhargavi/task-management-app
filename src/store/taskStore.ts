import { create } from 'zustand';
import { Task, TaskFormData, TaskFilters } from '@/src/types';

interface TaskStore {
  tasks: Task[];
  filters: TaskFilters;
  addTask: (taskData: TaskFormData) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [
    // Mock data for initial development
    {
      id: '1',
      title: 'Complete project setup',
      description: 'Set up Next.js project with all configurations',
      status: 'completed',
      priority: 'high',
      category: 'work',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      completed: true,
    },
    {
      id: '2',
      title: 'Review pull requests',
      description: 'Review and merge pending PRs',
      status: 'in-progress',
      priority: 'medium',
      category: 'work',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      completed: false,
    },
    {
      id: '3',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, vegetables',
      status: 'todo',
      priority: 'low',
      category: 'shopping',
      dueDate: new Date('2024-01-20'),
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      completed: false,
    },
  ],
  filters: {},

  addTask: (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: taskData.status === 'completed',
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: (id: string, taskData: Partial<Task>) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...taskData, updatedAt: new Date() }
          : task
      ),
    }));
  },

  deleteTask: (id: string) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  toggleTaskComplete: (id: string) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? 'completed' : 'todo',
              updatedAt: new Date(),
            }
          : task
      ),
    }));
  },

  setFilters: (filters: TaskFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter((task) => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.category && task.category !== filters.category) return false;
      if (
        filters.searchQuery &&
        !task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  },
}));


