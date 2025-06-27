'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/lib/actions';
import { TaskApp } from '@/components/task-app';
import type { Task } from '@/lib/definitions';

export default function TaskPage() {
  const [initialTasks, setInitialTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await getTasks();
        setInitialTasks(tasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 sm:p-8 max-w-3xl">
        <TaskApp initialTasks={initialTasks} />
      </main>
    </div>
  );
}
