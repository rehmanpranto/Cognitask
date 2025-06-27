'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Task } from './definitions';
import { suggestTask as suggestTaskFlow } from '@/ai/flows/suggest-task';
import { prioritizeTasks as prioritizeTasksFlow } from '@/ai/flows/prioritize-tasks';
import { createClient } from '@/lib/supabase/server';

// --- Task Actions ---

export async function getTasks(): Promise<Task[]> {
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
}

const AddTaskSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty.').max(100, 'Task is too long.'),
});

export async function addTaskAction(prevState: any, formData: FormData) {
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
}

export async function updateTaskAction(taskId: string, completed: boolean) {
  const supabase = createClient();
  await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', taskId);

  revalidatePath(`/`);
}

export async function deleteTaskAction(taskId: string) {
  const supabase = createClient();
  await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  revalidatePath(`/`);
}

export async function suggestTaskAction(): Promise<string> {
    const tasks = await getTasks();
    const existingTasks = tasks.map((task) => task.text);
    const result = await suggestTaskFlow({ existingTasks });
    return result.suggestedTask;
}

export async function prioritizeTasksAction() {
  const supabase = createClient();

  try {
    const userTasks = await getTasks();
    if (userTasks.length < 2) return { success: true };
    const prioritized = await prioritizeTasksFlow(userTasks);

    // This is not the most efficient way, but it's simple.
    // A better approach would be to update the 'position' or 'priority' column.
    await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const tasksToInsert = prioritized.map(task => ({
        text: task.text,
        completed: task.completed,
    }));
    await supabase.from('tasks').insert(tasksToInsert);
    
    revalidatePath(`/`);
    return { success: true };
  } catch(e) {
    console.error(e);
    return { success: false, error: "Failed to prioritize tasks." };
  }
}
