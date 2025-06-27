'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TASK_CATEGORIES, TASK_PRIORITIES, TaskCategory, TaskPriority } from '@/lib/definitions';

interface TaskFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: {
    category?: TaskCategory;
    priority?: TaskPriority;
    completed?: boolean;
    overdue?: boolean;
  }) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  taskCount: number;
}

export function TaskFilters({ onSearch, onFilter, onExport, onImport, taskCount }: TaskFiltersProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<TaskCategory | ''>('');
  const [priorityFilter, setPriorityFilter] = React.useState<TaskPriority | ''>('');
  const [completedFilter, setCompletedFilter] = React.useState<'all' | 'completed' | 'pending'>('all');
  const [overdueFilter, setOverdueFilter] = React.useState<'all' | 'overdue' | 'not-overdue'>('all');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = () => {
    onFilter({
      category: categoryFilter || undefined,
      priority: priorityFilter || undefined,
      completed: completedFilter === 'all' ? undefined : completedFilter === 'completed',
      overdue: overdueFilter === 'all' ? undefined : overdueFilter === 'overdue',
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setPriorityFilter('');
    setCompletedFilter('all');
    setOverdueFilter('all');
    onSearch('');
    onFilter({});
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImport(file);
      }
    };
    input.click();
  };

  const hasActiveFilters = searchQuery || categoryFilter || priorityFilter || 
    completedFilter !== 'all' || overdueFilter !== 'all';

  return (
    <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Filters & Search</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="text-xs"
          >
            📤 Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            className="text-xs"
          >
            📥 Import
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Input
            placeholder="Search tasks, descriptions, or tags..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
            <Select value={categoryFilter} onValueChange={(value: TaskCategory | '') => {
              setCategoryFilter(value);
              setTimeout(handleFilterChange, 0);
            }}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {Object.entries(TASK_CATEGORIES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
            <Select value={priorityFilter} onValueChange={(value: TaskPriority | '') => {
              setPriorityFilter(value);
              setTimeout(handleFilterChange, 0);
            }}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                {Object.entries(TASK_PRIORITIES).map(([key, { label, icon }]) => (
                  <SelectItem key={key} value={key}>
                    <span>{icon} {label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
            <Select value={completedFilter} onValueChange={(value: 'all' | 'completed' | 'pending') => {
              setCompletedFilter(value);
              setTimeout(handleFilterChange, 0);
            }}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Due Date</label>
            <Select value={overdueFilter} onValueChange={(value: 'all' | 'overdue' | 'not-overdue') => {
              setOverdueFilter(value);
              setTimeout(handleFilterChange, 0);
            }}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="not-overdue">Not Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all filters
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {taskCount} task{taskCount !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>
    </div>
  );
}
