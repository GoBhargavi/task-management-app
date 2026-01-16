'use client';

import { Task } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, CheckCircle2, Circle, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskComplete, deleteTask } = useTaskStore();

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast.success('Task deleted');
  }

  const handleToggle = (id: string) => {
    toggleTaskComplete(id);
    if (!task.completed) {
      toast.success('Task completed! 🎉');
    }
  }

  const priorityColors = {
    low: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50',
    medium: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50',
    high: 'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50',
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 border-0 shadow-sm hover:shadow-md",
      task.completed
        ? 'bg-slate-50/50 dark:bg-slate-900/10 opacity-70'
        : 'bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm'
    )}>
      {/* Priority Indicator Stripe */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
      )} />

      <CardContent className="p-4 pl-6">
        <div className="flex gap-4">

          {/* Checkbox Area */}
          <button
            onClick={() => handleToggle(task.id)}
            className="mt-1 flex-shrink-0 text-slate-400 hover:text-primary transition-colors focus:outline-none"
          >
            {task.completed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500 animate-in zoom-in duration-300" />
            ) : (
              <Circle className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
            )}
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-semibold text-base leading-tight truncate transition-all",
                task.completed && "line-through text-muted-foreground decoration-slate-400"
              )}>
                {task.title}
              </h3>
            </div>

            {task.description && (
              <p className={cn(
                "text-sm text-muted-foreground line-clamp-2 leading-relaxed",
                task.completed && "opacity-50"
              )}>
                {task.description}
              </p>
            )}

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline" className={cn("text-[10px] font-medium border uppercase tracking-wider", priorityColors[task.priority])}>
                {task.priority}
              </Badge>

              <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <Tag className="w-3 h-3 mr-1 opacity-50" /> {task.category}
              </Badge>

              {task.dueDate && (
                <div className="flex items-center text-[10px] font-medium text-muted-foreground bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-full">
                  <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
                  {format(new Date(task.dueDate), 'MMM d')}
                </div>
              )}
            </div>
          </div>

          {/* Actions (Visible on Hover) */}
          <div className="flex flex-col gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 translate-x-2 lg:group-hover:translate-x-0">
            {onEdit && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(task)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(task.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}