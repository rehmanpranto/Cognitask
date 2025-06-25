'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { Task } from './definitions';
import { suggestTask as suggestTaskFlow } from '@/ai/flows/suggest-task';
import { prioritizeTasks as prioritizeTasksFlow } from '@/ai/flows/prioritize-tasks';
import { createClient } from '@/lib/supabase/server';

// --- Auth Actions ---

const SignUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

// A set of common disposable email domains to prevent fake signups.
const disposableDomains = new Set([
    'mailinator.com',
    'temp-mail.org',
    '10minutemail.com',
    'guerrillamail.com',
    'yopmail.com',
    'getnada.com',
    'throwawaymail.com',
    'maildrop.cc',
]);

export async function signUpAction(prevState: any, formData: FormData) {
  const supabase = createClient();
  const validatedFields = SignUpSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  
  const emailDomain = email.split('@')[1];
  if (disposableDomains.has(emailDomain.toLowerCase())) {
    return {
      errors: { email: ['Please use a permanent email address. Disposable emails are not allowed.'] },
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if(error.message.includes('User already registered')) {
        return { errors: { email: ['User with this email already exists.'] } };
    }
    return {
      errors: { form: [error.message] },
    };
  }

  // Add default tasks for new user
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('tasks').insert([
        { user_id: user.id, text: 'Create your first task!', completed: false },
        { user_id: user.id, text: 'Welcome to the app', completed: true },
    ]);
  }

  redirect(`/login?message=Check email to continue sign in process`);
}

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export async function loginAction(prevState: any, formData: FormData) {
  const supabase = createClient();
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { email, password } = validatedFields.data;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errors: { form: ['Invalid email or password.'] },
    };
  }
  
  redirect(`/tasks/${data.user.id}`);
}


// --- Task Actions ---
async function getUserId() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if(error || !data?.user) {
        redirect('/login');
    }
    return data.user.id;
}


export async function getTasks(userId: string): Promise<Task[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.id !== userId) {
    // Or handle unauthorized access appropriately
    return [];
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
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

export async function addTaskAction(userId: string, prevState: any, formData: FormData) {
  const currentUserId = await getUserId();
  if (userId !== currentUserId) redirect('/login');

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
      user_id: currentUserId,
    })
    .select()
    .single();

  if(error) {
    return { errors: { task: ["Failed to add task."] } };
  }
  
  revalidatePath(`/tasks/${currentUserId}`);
  return { task: data as Task, errors: {} };
}

export async function updateTaskAction(userId: string, taskId: string, completed: boolean) {
  const currentUserId = await getUserId();
  if (userId !== currentUserId) return;

  const supabase = createClient();
  await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', taskId)
    .eq('user_id', currentUserId);

  revalidatePath(`/tasks/${currentUserId}`);
}

export async function deleteTaskAction(userId: string, taskId: string) {
  const currentUserId = await getUserId();
  if (userId !== currentUserId) return;
  
  const supabase = createClient();
  await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', currentUserId);

  revalidatePath(`/tasks/${currentUserId}`);
}

export async function suggestTaskAction(userId: string): Promise<string> {
    const currentUserId = await getUserId();
    if (userId !== currentUserId) return '';
    
    const tasks = await getTasks(currentUserId);
    const existingTasks = tasks.map((task) => task.text);
    const result = await suggestTaskFlow({ existingTasks });
    return result.suggestedTask;
}

export async function prioritizeTasksAction(userId: string) {
  const currentUserId = await getUserId();
  if (userId !== currentUserId) return { success: false, error: "User not found." };
  const supabase = createClient();

  try {
    const userTasks = await getTasks(currentUserId);
    if (userTasks.length < 2) return { success: true };
    const prioritized = await prioritizeTasksFlow(userTasks);

    // This is not the most efficient way, but it's simple.
    // A better approach would be to update the 'position' or 'priority' column.
    await supabase.from('tasks').delete().eq('user_id', currentUserId);
    const tasksToInsert = prioritized.map(task => ({
        user_id: currentUserId,
        text: task.text,
        completed: task.completed,
    }));
    await supabase.from('tasks').insert(tasksToInsert);
    
    revalidatePath(`/tasks/${currentUserId}`);
    return { success: true };
  } catch(e) {
    console.error(e);
    return { success: false, error: "Failed to prioritize tasks." };
  }
}
