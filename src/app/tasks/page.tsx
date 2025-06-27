// @ts-nocheck
'use client';

import { TaskApp } from '@/components/task-app';

// Mock initial tasks for demo
const mockTasks = [
  { 
    id: '1', 
    text: 'Complete project documentation', 
    completed: false, 
    created_at: new Date().toISOString(),
    category: 'work',
    priority: 'high'
  },
  { 
    id: '2', 
    text: 'Review code changes', 
    completed: true, 
    created_at: new Date().toISOString(),
    category: 'work',
    priority: 'medium'
  },
];

export default function TaskPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 sm:p-8 max-w-3xl">
        <TaskApp initialTasks={mockTasks} />
      </main>
    </div>
  );
}
