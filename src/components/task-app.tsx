'use client';

import React, { useOptimistic, useTransition, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/definitions';
import {
  addTaskAction,
  deleteTaskAction,
  updateTaskAction,
  suggestTaskAction,
  prioritizeTasksAction,
} from '@/lib/actions';
import { ThemeToggle } from './theme-toggle';
import { Loader, Wand2, ArrowUpDown, Square, CheckSquare, Trash2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="rounded-md">
      {pending ? <Loader className="animate-spin" /> : 'Add Task'}
    </Button>
  );
}

export function TaskApp({ initialTasks, userId }: { initialTasks: Task[]; userId: string }) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic<Task[], Task>(
    initialTasks,
    (state, newTask) => [...state, newTask]
  );
  
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const formAction = async (formData: FormData) => {
    const text = formData.get('task') as string;
    if (!text.trim()) return;

    const optimisticTask: Task = {
      id: Math.random().toString(),
      text,
      completed: false,
    };
    
    startTransition(() => {
        setOptimisticTasks(optimisticTask);
    });

    formRef.current?.reset();
    
    const addTaskWithUserId = addTaskAction.bind(null, userId);
    const result = await addTaskWithUserId(null, formData);
    
    if(result?.errors?.task) {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.errors.task[0],
        });
    }
  };

  const handleSuggestTask = async () => {
    startTransition(async () => {
      const suggestTaskWithUserId = suggestTaskAction.bind(null, userId);
      const suggestedText = await suggestTaskWithUserId();
      if (!suggestedText) return;

      const formData = new FormData();
      formData.append('task', suggestedText);

      const optimisticTask: Task = { id: Math.random().toString(), text: suggestedText, completed: false };
      setOptimisticTasks(optimisticTask);
      
      const addTaskWithUserId = addTaskAction.bind(null, userId);
      await addTaskWithUserId(null, formData);
      
      toast({
        title: "Suggested Task Added",
        description: "A new task has been suggested and added to your list.",
      })
    });
  };

  const handlePrioritizeTasks = async () => {
    startTransition(async () => {
      const prioritizeTasksWithUserId = prioritizeTasksAction.bind(null, userId);
      const result = await prioritizeTasksWithUserId();
      if(result.success) {
        toast({
            title: "Tasks Prioritized",
            description: "Your tasks have been re-ordered by AI.",
        });
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to prioritize tasks.",
        });
      }
    });
  };

  const updateTaskWithUserId = updateTaskAction.bind(null, userId);
  const deleteTaskWithUserId = deleteTaskAction.bind(null, userId);

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Tasks
        </h1>
        <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Logout</Link>
            <ThemeToggle />
        </div>
      </header>
      
      <div className="mb-4">
        <form ref={formRef} action={formAction} className="flex gap-2">
          <Input name="task" placeholder="e.g., Finalize project report" className="bg-secondary focus:ring-ring rounded-md" />
          <SubmitButton />
        </form>
      </div>

      <div className="flex gap-2 justify-start mb-6">
        <Button onClick={handleSuggestTask} disabled={isPending} variant="outline" className="rounded-md text-sm">
            {isPending ? <Loader className="animate-spin mr-2"/> : <Wand2 className="mr-2" />}
            Suggest
        </Button>
        <Button onClick={handlePrioritizeTasks} disabled={isPending || optimisticTasks.length < 2} variant="outline" className="rounded-md text-sm">
            {isPending ? <Loader className="animate-spin mr-2"/> : <ArrowUpDown className="mr-2" />}
            Prioritize
        </Button>
      </div>

      <div className="space-y-1">
        {optimisticTasks.map((task) => (
          <div key={task.id} className={`group flex items-center p-1 rounded-md transition-colors duration-200 hover:bg-secondary ${task.completed ? 'opacity-60' : ''}`}>
            <button
                onClick={() => startTransition(() => updateTaskWithUserId(task.id, !task.completed))}
                className="p-2"
                aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
                {task.completed ? <CheckSquare className="h-5 w-5 text-muted-foreground" /> : <Square className="h-5 w-5 text-muted-foreground" />}
            </button>
            <p className={`flex-grow px-2 text-base ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.text}
            </p>
            <button
                onClick={() => startTransition(() => deleteTaskWithUserId(task.id))}
                className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete task"
            >
                <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
