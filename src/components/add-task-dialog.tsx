'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TASK_CATEGORIES, TASK_PRIORITIES, TaskCategory, TaskPriority } from '@/lib/definitions';

interface AddTaskDialogProps {
  onAddTask: (
    text: string,
    description?: string,
    category?: TaskCategory,
    priority?: TaskPriority,
    dueDate?: string,
    tags?: string[]
  ) => Promise<void>;
  isLoading?: boolean;
}

export function AddTaskDialog({ onAddTask, isLoading }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('other');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<Date>();
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!text.trim()) return;

    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 5); // Limit to 5 tags

    try {
      await onAddTask(
        text.trim(),
        description.trim() || undefined,
        category,
        priority,
        dueDate?.toISOString(),
        tagArray.length > 0 ? tagArray : undefined
      );

      // Reset form
      setText('');
      setDescription('');
      setCategory('other');
      setPriority('medium');
      setDueDate(undefined);
      setTags('');
      setOpen(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-text">Task</Label>
            <Input
              id="task-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Finalize project report"
              maxLength={100}
              disabled={isLoading}
            />
            <div className="text-xs text-muted-foreground text-right">
              {text.length}/100
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description (optional)</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="resize-none"
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
            <div className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value: TaskCategory) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_CATEGORIES).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", TASK_CATEGORIES[key as TaskCategory].bgColor)} />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_PRIORITIES).map(([key, { label, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{icon}</span>
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? dueDate.toLocaleDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-tags">Tags (optional)</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="task-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="work, urgent, meeting (comma separated)"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {tags && (
              <div className="text-xs text-muted-foreground">
                {tags.split(',').length} tag(s) • Max 5 tags allowed
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !text.trim()}>
              {isLoading ? 'Adding...' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
