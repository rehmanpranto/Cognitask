// All database/API functionality removed - using local state management only

import type { Task } from './definitions';

// Mock data for demo purposes
const mockTasks: Task[] = [
  { id: '1', text: 'Complete project documentation', completed: false, created_at: new Date().toISOString() },
  { id: '2', text: 'Review code changes', completed: true, created_at: new Date().toISOString() },
  { id: '3', text: 'Update task management system', completed: false, created_at: new Date().toISOString() },
];

// Local storage key
const TASKS_STORAGE_KEY = 'cognitask_tasks';

// Utility functions for localStorage
const getTasksFromStorage = (): Task[] => {
  if (typeof window === 'undefined') return mockTasks;
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockTasks;
  } catch {
    return mockTasks;
  }
};

const saveTasksToStorage = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

// Local state management functions
export async function getTasks(): Promise<Task[]> {
  return getTasksFromStorage();
}

export async function addTaskAction(taskText: string): Promise<{ task?: Task; errors?: any }> {
  try {
    if (!taskText || taskText.trim().length === 0) {
      return { errors: { task: ['Task cannot be empty.'] } };
    }
    
    if (taskText.length > 100) {
      return { errors: { task: ['Task is too long.'] } };
    }

    const tasks = getTasksFromStorage();
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText.trim(),
      completed: false,
      created_at: new Date().toISOString(),
    };
    
    const updatedTasks = [newTask, ...tasks];
    saveTasksToStorage(updatedTasks);
    
    return { task: newTask, errors: {} };
  } catch (error) {
    console.error('Failed to add task:', error);
    return { errors: { task: ['Failed to add task.'] } };
  }
}

export async function updateTaskAction(taskId: string, completed: boolean): Promise<void> {
  try {
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
    saveTasksToStorage(updatedTasks);
  } catch (error) {
    console.error('Failed to update task:', error);
  }
}

export async function deleteTaskAction(taskId: string): Promise<void> {
  try {
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasksToStorage(updatedTasks);
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
}

export async function prioritizeTasksAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const tasks = getTasksFromStorage();
    if (tasks.length < 2) return { success: true };
    
    // Simple prioritization: incomplete tasks first, then completed
    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    // Sort incomplete tasks by length (shorter tasks first as they might be quicker)
    incompleteTasks.sort((a, b) => a.text.length - b.text.length);
    
    const prioritizedTasks = [...incompleteTasks, ...completedTasks];
    saveTasksToStorage(prioritizedTasks);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to prioritize tasks:', error);
    return { success: false, error: 'Failed to prioritize tasks.' };
  }
}
