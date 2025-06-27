'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Task } from './definitions';
import { suggestTask as suggestTaskFlow } from '@/ai/flows/suggest-task';
import { prioritizeTasks as prioritizeTasksFlow } from '@/ai/flows/prioritize-tasks';
import { createClient } from '@/lib/supabase/server';

// --- Task Actions ---

export async function getTasks(): Promise<Task[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get tasks:', error);
    return [];
  }
}

const AddTaskSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty.').max(100, 'Task is too long.'),
});

export async function addTaskAction(prevState: any, formData: FormData) {
  try {
    const supabase = createClient();
    const validatedFields = AddTaskSchema.safeParse({
      task: formData.get('task'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const { error, data } = await supabase
      .from('tasks')
      .insert({
        text: validatedFields.data.task,
      })
      .select()
      .single();

    if(error) {
      return { errors: { task: ["Failed to add task."] } };
    }
    
    revalidatePath(`/`);
    return { task: data as Task, errors: {} };
  } catch (error) {
    console.error('Failed to add task:', error);
    return { errors: { task: ["Failed to add task."] } };
  }
}

export async function updateTaskAction(taskId: string, completed: boolean) {
  try {
    const supabase = createClient();
    await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId);

    revalidatePath(`/`);
  } catch (error) {
    console.error('Failed to update task:', error);
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    const supabase = createClient();
    await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    revalidatePath(`/`);
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
}

export async function suggestTaskAction(): Promise<string> {
  try {
    const tasks = await getTasks();
    const existingTasks = tasks.map((task) => task.text);
    const result = await suggestTaskFlow({ existingTasks });
    return result.suggestedTask;
  } catch (error) {
    console.error('Failed to suggest task:', error);
    return 'Complete a daily review of your progress';
  }
}

export async function prioritizeTasksAction() {
  try {
    const supabase = createClient();
    const userTasks = await getTasks();
    if (userTasks.length < 2) return { success: true };
    const prioritized = await prioritizeTasksFlow(userTasks);

    // This is not the most efficient way, but it's simple.
    // A better approach would be to update the 'position' or 'priority' column.
    await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const tasksToInsert = prioritized.map((task: any) => ({
        text: task.text,
        completed: task.completed,
    }));
    await supabase.from('tasks').insert(tasksToInsert);
    
    revalidatePath(`/`);
    return { success: true };
  } catch(error) {
    console.error('Failed to prioritize tasks:', error);
    return { success: false, error: "Failed to prioritize tasks." };
  }
}
