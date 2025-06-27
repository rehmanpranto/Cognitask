'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Task, TaskCategory, TaskPriority } from '@/lib/definitions';
import {
  addTaskAction,
  deleteTaskAction,
  updateTaskAction,
  prioritizeTasksAction,
  getTasks,
  searchTasks,
  filterTasks,
  exportTasks,
  importTasks,
  getTaskStats,
} from '@/lib/actions';
import { ThemeToggle } from './theme-toggle';
import { AddTaskDialog } from './add-task-dialog';
import { TaskCard } from './task-card';
import { TaskFilters } from './task-filters';
import { ArrowUpDown } from 'lucide-react';
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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  // Refresh tasks from localStorage
  const refreshTasks = async () => {
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    
    // Update stats
    const taskStats = await getTaskStats();
    setStats(taskStats);
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const handleAddTask = async (
    text: string,
    description?: string,
    category?: TaskCategory,
    priority?: TaskPriority,
    dueDate?: string,
    tags?: string[]
  ) => {
    setIsLoading(true);
    const result = await addTaskAction(text, description, category, priority, dueDate, tags);

    if (result?.errors?.task) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.errors.task[0],
      });
    } else {
      await refreshTasks();
      toast({
        title: 'Task Added',
        description: 'New task has been added successfully.',
      });
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
        description: 'Your tasks have been re-ordered by priority and due dates.',
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
    await updateTaskAction(taskId, { completed });
    await refreshTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskAction(taskId);
    await refreshTasks();
    toast({
      title: 'Task Deleted',
      description: 'Task has been removed.',
    });
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredTasks(tasks);
      return;
    }
    const searchResults = await searchTasks(query);
    setFilteredTasks(searchResults);
  };

  const handleFilter = async (filters: {
    category?: TaskCategory;
    priority?: TaskPriority;
    completed?: boolean;
    overdue?: boolean;
  }) => {
    const filterResults = await filterTasks(
      filters.category,
      filters.priority,
      filters.completed,
      filters.overdue
    );
    setFilteredTasks(filterResults);
  };

  const handleExport = async () => {
    try {
      const exportData = await exportTasks();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cognitask-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: 'Your tasks have been exported to a JSON file.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Failed to export tasks.',
      });
    }
  };

  const handleImport = async (file: File) => {
    try {
      const content = await file.text();
      const result = await importTasks(content);
      
      if (result.success) {
        await refreshTasks();
        toast({
          title: 'Import Successful',
          description: 'Tasks have been imported successfully.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Import Failed',
          description: result.error || 'Failed to import tasks.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: 'Failed to read the file.',
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Cognitask</CardTitle>
              <CardDescription>
                Your intelligent task manager with enhanced features
              </CardDescription>
            </div>
            <ThemeToggle />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <AddTaskDialog onAddTask={handleAddTask} isLoading={isLoading} />
            </div>
            <Button
              onClick={handlePrioritizeTasks}
              disabled={isLoading || tasks.length < 2}
              variant="outline"
            >
              ↕️ Prioritize
            </Button>
          </div>

          <TaskFilters
            onSearch={handleSearch}
            onFilter={handleFilter}
            onExport={handleExport}
            onImport={handleImport}
            taskCount={filteredTasks.length}
          />

          <Separator />

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">{stats.total - stats.completed}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
          )}

          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-sm">No tasks found</div>
                  <div className="text-xs">Try adjusting your filters or add a new task</div>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <span>Data stored locally in your browser</span>
          <span>
            {filteredTasks.length !== tasks.length 
              ? `${filteredTasks.length} of ${tasks.length} tasks shown`
              : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} total`
            }
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
