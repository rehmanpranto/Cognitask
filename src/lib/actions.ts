// All database/API functionality removed - using local state management only

import type { Task, TaskCategory, TaskPriority } from './definitions';

// Mock data for demo purposes
const mockTasks: Task[] = [
  { 
    id: '1', 
    text: 'Complete project documentation', 
    description: 'Write comprehensive docs for the new feature',
    completed: false, 
    created_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    category: 'work',
    priority: 'high',
    tags: ['documentation', 'urgent']
  },
  { 
    id: '2', 
    text: 'Review code changes', 
    completed: true, 
    created_at: new Date().toISOString(),
    category: 'work',
    priority: 'medium'
  },
  { 
    id: '3', 
    text: 'Buy groceries', 
    description: 'Milk, bread, eggs, vegetables',
    completed: false, 
    created_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    category: 'shopping',
    priority: 'medium',
    tags: ['weekly']
  },
  { 
    id: '4', 
    text: 'Exercise routine', 
    completed: false, 
    created_at: new Date().toISOString(),
    category: 'health',
    priority: 'low'
  },
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

export async function addTaskAction(
  taskText: string, 
  description?: string,
  category: TaskCategory = 'other',
  priority: TaskPriority = 'medium',
  dueDate?: string,
  tags?: string[]
): Promise<{ task?: Task; errors?: any }> {
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
      description: description?.trim(),
      completed: false,
      created_at: new Date().toISOString(),
      due_date: dueDate,
      category,
      priority,
      tags: tags?.filter(tag => tag.trim().length > 0) || [],
    };
    
    const updatedTasks = [newTask, ...tasks];
    saveTasksToStorage(updatedTasks);
    
    return { task: newTask, errors: {} };
  } catch (error) {
    console.error('Failed to add task:', error);
    return { errors: { task: ['Failed to add task.'] } };
  }
}

export async function updateTaskAction(
  taskId: string, 
  updates: Partial<Omit<Task, 'id' | 'created_at'>>
): Promise<void> {
  try {
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
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
    
    // Enhanced prioritization: priority first, then due dates, then incomplete tasks
    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    // Sort incomplete tasks by priority (high->medium->low), then by due date
    incompleteTasks.sort((a, b) => {
      // Priority comparison
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Due date comparison (earlier dates first)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (a.due_date) {
        return -1; // Tasks with due dates come first
      } else if (b.due_date) {
        return 1;
      }
      
      // Fall back to text length (shorter tasks first)
      return a.text.length - b.text.length;
    });
    
    const prioritizedTasks = [...incompleteTasks, ...completedTasks];
    saveTasksToStorage(prioritizedTasks);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to prioritize tasks:', error);
    return { success: false, error: 'Failed to prioritize tasks.' };
  }
}

export async function searchTasks(query: string): Promise<Task[]> {
  const tasks = getTasksFromStorage();
  if (!query.trim()) return tasks;
  
  const searchTerm = query.toLowerCase();
  return tasks.filter(task => 
    task.text.toLowerCase().includes(searchTerm) ||
    task.description?.toLowerCase().includes(searchTerm) ||
    task.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export async function filterTasks(
  category?: TaskCategory,
  priority?: TaskPriority,
  completed?: boolean,
  overdue?: boolean
): Promise<Task[]> {
  const tasks = getTasksFromStorage();
  
  return tasks.filter(task => {
    if (category && task.category !== category) return false;
    if (priority && task.priority !== priority) return false;
    if (completed !== undefined && task.completed !== completed) return false;
    if (overdue !== undefined) {
      const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
      if (overdue && !isOverdue) return false;
      if (!overdue && isOverdue) return false;
    }
    return true;
  });
}

export async function exportTasks(): Promise<string> {
  const tasks = getTasksFromStorage();
  return JSON.stringify(tasks, null, 2);
}

export async function importTasks(jsonData: string): Promise<{ success: boolean; error?: string }> {
  try {
    const importedTasks = JSON.parse(jsonData) as Task[];
    
    // Validate imported data
    if (!Array.isArray(importedTasks)) {
      return { success: false, error: 'Invalid data format' };
    }
    
    // Merge with existing tasks, avoiding duplicates
    const existingTasks = getTasksFromStorage();
    const existingIds = new Set(existingTasks.map(task => task.id));
    
    const newTasks = importedTasks.filter(task => !existingIds.has(task.id));
    const mergedTasks = [...existingTasks, ...newTasks];
    
    saveTasksToStorage(mergedTasks);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to parse JSON data' };
  }
}

export async function getTaskStats(): Promise<{
  total: number;
  completed: number;
  overdue: number;
  byCategory: Record<TaskCategory, number>;
  byPriority: Record<TaskPriority, number>;
}> {
  const tasks = getTasksFromStorage();
  const now = new Date();
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    overdue: tasks.filter(task => 
      task.due_date && new Date(task.due_date) < now && !task.completed
    ).length,
    byCategory: {} as Record<TaskCategory, number>,
    byPriority: {} as Record<TaskPriority, number>,
  };
  
  // Initialize counters
  (['work', 'personal', 'shopping', 'health', 'learning', 'other'] as TaskCategory[]).forEach(cat => {
    stats.byCategory[cat] = 0;
  });
  (['low', 'medium', 'high'] as TaskPriority[]).forEach(pri => {
    stats.byPriority[pri] = 0;
  });
  
  // Count tasks
  tasks.forEach(task => {
    stats.byCategory[task.category]++;
    stats.byPriority[task.priority]++;
  });
  
  return stats;
}
