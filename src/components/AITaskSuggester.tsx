'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import { aiService } from '@/lib/api/aiService';
import { useTaskStore } from '@/store/taskStore';

export default function AITaskSuggester() {
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { addTask } = useTaskStore();

  const handleGetSuggestions = async () => {
    if (!context.trim()) {
      alert('Please enter a context or goal');
      return;
    }
    
    setLoading(true);
    try {
      const tasks = await aiService.suggestTasks(context);
      console.log('✅ AI Response:', tasks);
      setSuggestions(tasks);
    } catch (error) {
      alert('Failed to get AI suggestions. Check console for details.');
      console.error('❌ Error:', error);
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
      priority: task.priority,
      category: task.category,
    });
    alert(`✅ Task "${task.title}" added!`);
  };

  const handleAddAllTasks = () => {
    suggestions.forEach(task => {
      addTask({
        title: task.title,
        description: task.description,
        status: 'todo',
        priority: task.priority,
        category: task.category,
      });
    });
    alert(`✅ All ${suggestions.length} tasks added!`);
    setSuggestions([]);
    setContext('');
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Task Suggester
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Tell me your goal and I'll suggest actionable tasks
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Input Section */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Prepare for job interview, Launch new website, Learn React..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGetSuggestions()}
              className="flex-1"
            />
            <Button 
              onClick={handleGetSuggestions} 
              disabled={loading || !context.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suggest
                </>
              )}
            </Button>
          </div>

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  AI Suggested {suggestions.length} Tasks:
                </h3>
                <Button
                  size="sm"
                  onClick={handleAddAllTasks}
                  variant="outline"
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add All
                </Button>
              </div>

              {suggestions.map((task, index) => (
                <Card key={index} className="bg-white border-purple-100 hover:border-purple-300 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {task.description}
                        </p>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                            {task.category}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddTask(task)}
                        className="bg-purple-600 hover:bg-purple-700 shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">AI is generating tasks...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}