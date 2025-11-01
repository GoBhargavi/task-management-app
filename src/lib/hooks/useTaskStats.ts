import { useMemo } from 'react';
import { useTaskStore } from '@/src/store/taskStore';

export const useTaskStats = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

    return {
      total,
      completed,
      inProgress,
      todo,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  return stats;
};