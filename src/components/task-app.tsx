'use client';

import React, { useOptimistic, useTransition, useRef } from 'react';
import { useFormStatus } from 'react-dom';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader className="animate-spin" /> : 'Add Task'}
    </Button>
  );
}

export function TaskApp({ initialTasks }: { initialTasks: Task[] }) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic<Task[], Task>(
    initialTasks,
    (state, newTask) => [...state, { ...newTask, id: Math.random().toString() }]
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

    formRef.current?.reset();
    
    startTransition(() => {
      setOptimisticTasks(optimisticTask);
    });

    const result = await addTaskAction(null, formData);

    if (result?.errors?.task) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.errors.task[0],
      });
    }
  };

  const handleSuggestTask = async () => {
    startTransition(async () => {
      try {
        const suggestedText = await suggestTaskAction();
        if (!suggestedText) return;

        const formData = new FormData();
        formData.append('task', suggestedText);

        const optimisticTask: Task = {
          id: Math.random().toString(),
          text: suggestedText,
          completed: false,
        };
        setOptimisticTasks(optimisticTask);

        await addTaskAction(null, formData);

        toast({
          title: 'Suggested Task Added',
          description: 'A new task has been suggested and added to your list.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'AI Error',
          description: 'Could not get a suggestion at this time.',
        });
      }
    });
  };

  const handlePrioritizeTasks = async () => {
    startTransition(async () => {
      const result = await prioritizeTasksAction();
      if (result.success) {
        toast({
          title: 'Tasks Prioritized',
          description: 'Your tasks have been re-ordered by AI.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to prioritize tasks.',
        });
      }
    });
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
          <form ref={formRef} action={formAction} className="flex gap-2">
            <Input
              name="task"
              placeholder="e.g., Finalize project report"
              className="bg-secondary focus:ring-ring"
            />
            <SubmitButton />
          </form>
          <div className="flex gap-2 justify-start mt-4">
            <Button
              onClick={handleSuggestTask}
              disabled={isPending}
              variant="outline"
              size="sm"
            >
              <Wand2 />
              Suggest
            </Button>
            <Button
              onClick={handlePrioritizeTasks}
              disabled={isPending || optimisticTasks.length < 2}
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
              {optimisticTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center p-1 rounded-md transition-colors duration-200 hover:bg-secondary ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() =>
                      startTransition(() =>
                        updateTaskAction(task.id, !task.completed)
                      )
                    }
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
                    onClick={() =>
                      startTransition(() => deleteTaskAction(task.id))
                    }
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
            {optimisticTasks.length} task(s)
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
