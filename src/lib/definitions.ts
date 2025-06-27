export type TaskCategory = 'work' | 'personal' | 'shopping' | 'health' | 'learning' | 'other';

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  created_at?: string;
  due_date?: string;
  category: TaskCategory;
  priority: TaskPriority;
  tags?: string[];
};

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; color: string; bgColor: string }> = {
  work: { label: 'Work', color: 'text-blue-600', bgColor: 'bg-blue-500' },
  personal: { label: 'Personal', color: 'text-green-600', bgColor: 'bg-green-500' },
  shopping: { label: 'Shopping', color: 'text-purple-600', bgColor: 'bg-purple-500' },
  health: { label: 'Health', color: 'text-red-600', bgColor: 'bg-red-500' },
  learning: { label: 'Learning', color: 'text-orange-600', bgColor: 'bg-orange-500' },
  other: { label: 'Other', color: 'text-gray-600', bgColor: 'bg-gray-500' },
};

export const TASK_PRIORITIES: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  low: { label: 'Low', color: 'text-gray-500', icon: '▼' },
  medium: { label: 'Medium', color: 'text-yellow-500', icon: '◆' },
  high: { label: 'High', color: 'text-red-500', icon: '▲' },
};

// Utility functions
export const formatDueDate = (dueDate: string): string => {
  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString();
  }
};

export const isTaskOverdue = (dueDate: string): boolean => {
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const getTaskCategoryInfo = (category: TaskCategory) => TASK_CATEGORIES[category];
export const getTaskPriorityInfo = (priority: TaskPriority) => TASK_PRIORITIES[priority];
