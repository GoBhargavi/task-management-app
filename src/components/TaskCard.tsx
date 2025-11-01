'use client';

import { Task } from '@/src/types';
import { useTaskStore } from '@/src/store/taskStore';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Trash2, Edit, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskComplete, deleteTask } = useTaskStore();

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <Card className={task.completed ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => toggleTaskComplete(task.id)}
              className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1">
              <h3
                className={`font-semibold ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              statusColors[task.status]
            }`}
          >
            {task.status}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
            {task.category}
          </span>
          {task.dueDate && (
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
              Due: {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}