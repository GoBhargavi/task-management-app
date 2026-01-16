'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Plus, ArrowRight } from 'lucide-react';
import { aiService } from '@/lib/api/aiService';
import { useTaskStore } from '@/store/taskStore';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AITaskSuggester() {
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { addTask } = useTaskStore();

  const handleGetSuggestions = async () => {
    if (!context.trim()) {
      toast.error('Please enter a goal first');
      return;
    }

    setLoading(true);
    try {
      const tasks = await aiService.suggestTasks(context);
      setSuggestions(tasks);
      toast.success('AI Suggestions ready!');
    } catch (error) {
      toast.error('Failed to get suggestions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (task: any) => {
    addTask({
      title: task.title,
      description: task.description,
      status: 'todo',
      priority: task.priority || 'medium',
      category: task.category || 'other',
    });
    toast.success(`Task added: ${task.title}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 relative group">
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-pulse" />
          <Input
            placeholder="What do you want to achieve? (e.g. 'Plan a marketing campaign')"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestions()}
            className="pl-10 h-12 bg-white/50 dark:bg-black/20 border-primary/20 focus:border-primary/50 text-lg shadow-sm w-full transition-all"
          />
        </div>
        <Button
          onClick={handleGetSuggestions}
          disabled={loading || !context.trim()}
          size="lg"
          className="h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
          </div>
          <p className="text-muted-foreground font-medium animate-pulse">Thinking about "{context}"...</p>
        </div>
      )}

      {suggestions.length > 0 && !loading && (
        <div className="grid gap-4 animate-in slide-in-from-bottom-4 duration-500 stagger-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Suggested Tasks</h3>
            <Button variant="ghost" size="sm" onClick={() => setSuggestions([])} className="text-muted-foreground hover:text-destructive">Clear</Button>
          </div>
          {suggestions.map((task, index) => (
            <Card key={index} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-white/60 dark:bg-zinc-900/40">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{task.title}</h4>
                    <Badge variant="outline" className="text-[10px] uppercase">{task.category}</Badge>
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">{task.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleAddTask(task)}
                  className="shrink-0 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-sm hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}