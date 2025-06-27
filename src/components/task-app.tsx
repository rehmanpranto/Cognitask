'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/definitions';
import {
  addTaskAction,
  deleteTaskAction,
  updateTaskAction,
  prioritizeTasksAction,
  getTasks,
} from '@/lib/actions';
import { ThemeToggle } from './theme-toggle';
import { Loader, ArrowUpDown, Square, CheckSquare, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TaskApp({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const { toast } = useToast();

  // Refresh tasks from localStorage
  const refreshTasks = async () => {
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    setIsLoading(true);
    const result = await addTaskAction(newTaskText);

    if (result?.errors?.task) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.errors.task[0],
      });
    } else {
      setNewTaskText('');
      await refreshTasks();
    }
    setIsLoading(false);
  };

  const handlePrioritizeTasks = async () => {
    setIsLoading(true);
    const result = await prioritizeTasksAction();
    if (result.success) {
      await refreshTasks();
      toast({
        title: 'Tasks Prioritized',
        description: 'Your tasks have been re-ordered by priority.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to prioritize tasks.',
      });
    }
    setIsLoading(false);
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    await updateTaskAction(taskId, completed);
    await refreshTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskAction(taskId);
    await refreshTasks();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Cognitask</CardTitle>
            <ThemeToggle />
          </div>
          <CardDescription>
            Your intelligent task manager. Add a task to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="e.g., Finalize project report"
              className="bg-secondary focus:ring-ring"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !newTaskText.trim()}>
              {isLoading ? <Loader className="animate-spin" /> : 'Add Task'}
            </Button>
          </form>
          <div className="flex gap-2 justify-start mt-4">
            <Button
              onClick={handlePrioritizeTasks}
              disabled={isLoading || tasks.length < 2}
              variant="outline"
              size="sm"
            >
              <ArrowUpDown />
              Prioritize
            </Button>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="h-60">
            <div className="space-y-1 pr-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center p-1 rounded-md transition-colors duration-200 hover:bg-secondary ${ 
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => handleToggleTask(task.id, !task.completed)}
                    className="p-2"
                    aria-label={
                      task.completed
                        ? 'Mark as incomplete'
                        : 'Mark as complete'
                    }
                  >
                    {task.completed ? (
                      <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <p
                    className={`flex-grow px-2 text-base ${
                      task.completed
                        ? 'line-through text-muted-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {task.text}
                  </p>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            {tasks.length} task(s) • Data stored locally in your browser
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
