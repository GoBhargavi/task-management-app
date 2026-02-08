'use client';

import { useTaskStats } from '@/lib/hooks/useTaskStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, ListTodo, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AITaskSuggester from '@/components/AITaskSuggester';

export default function DashboardPage() {
  const stats = useTaskStats();

  const statCards = [
    {
      title: 'Current Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
      description: 'Tasks in your queue'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      description: 'Tasks finished'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      description: 'Working on now'
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
      description: 'Needs attention'
    },
  ];

  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            Hello, <span className="text-gradient">There!</span> 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Here&apos;s your productivity overview for today.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/tasks">
            <Button variant="ghost" className="gap-2">
              View All Tasks <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/tasks?action=new">
            <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2">
              <Plus className="w-4 h-4" /> New Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <Card key={stat.title} className="glass-card border-none overflow-hidden relative group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
              <stat.icon className={`w-24 h-24 ${stat.color}`} />
            </div>

            <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bgColor} transition-colors`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="z-10 relative">
              <div className="text-4xl font-bold tracking-tight mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">

          {/* AI Task Suggester */}
          <div className="glass rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                ✨ AI Assistant
              </h2>
              <p className="text-muted-foreground">Get intelligent suggestions for your next steps.</p>
            </div>
            <AITaskSuggester />
          </div>

        </div>

        {/* Sidebar Area (Right 1/3) */}
        <div className="space-y-8">
          {/* Completion Rate */}
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Daily Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="relative pt-2">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary/10 text-primary">
                        Productivity
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        {stats.completionRate}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-secondary">
                    <div style={{ width: `${stats.completionRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out"></div>
                  </div>
                </div>

                <div className="text-center p-6 bg-secondary/50 rounded-xl">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Tasks Completed
                  </p>
                  <div className="text-3xl font-bold text-primary">
                    {stats.completed} <span className="text-lg text-muted-foreground font-normal">/ {stats.total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tip / Inspiration Card (Static Example) */}
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">💡 Pro Tip</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Breaking down large tasks into smaller steps increases completion rates by 40%. Use our AI breakdown tool to help!
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
