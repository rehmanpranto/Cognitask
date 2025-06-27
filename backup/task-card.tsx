'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Task, TASK_CATEGORIES, TASK_PRIORITIES } from '@/lib/definitions';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
  const isDueSoon = task.due_date && 
    new Date(task.due_date) > new Date() && 
    new Date(task.due_date) < new Date(Date.now() + 24 * 60 * 60 * 1000) && 
    !task.completed;

  const categoryStyle = TASK_CATEGORIES[task.category];
  const priorityStyle = TASK_PRIORITIES[task.priority];

  return (
    <>
      <div className={cn(
        "group flex items-center p-3 rounded-md transition-colors duration-200 hover:bg-secondary border-l-4",
        task.completed ? "opacity-60" : "",
        isOverdue ? "border-l-red-500 bg-red-50/50 dark:bg-red-950/20" : 
        isDueSoon ? "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20" : 
        "border-l-gray-300"
      )}>
        <button
          onClick={() => onToggle(task.id, !task.completed)}
          className="p-2"
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <div className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center",
            task.completed ? "bg-primary border-primary" : "border-muted-foreground"
          )}>
            {task.completed && <span className="text-primary-foreground text-xs">✓</span>}
          </div>
        </button>
        
        <div className="flex-1 min-w-0 px-3">
          <div className="flex items-center gap-2 mb-1">
            <h3 
              className={cn(
                "font-medium text-sm leading-tight cursor-pointer hover:text-primary",
                task.completed ? "line-through text-muted-foreground" : ""
              )}
              onClick={() => setShowDetails(true)}
            >
              {task.text}
            </h3>
            <span className={cn("text-xs ml-auto", priorityStyle.color)} title={`${priorityStyle.label} Priority`}>
              {priorityStyle.icon}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("px-2 py-1 rounded text-xs", categoryStyle.bgColor, categoryStyle.color)}>
              {categoryStyle.label}
            </span>
            
            {task.due_date && (
              <span className={cn(
                isOverdue ? "text-red-600" : isDueSoon ? "text-yellow-600" : ""
              )}>
                📅 {new Date(task.due_date).toLocaleDateString()}
                {isOverdue && " (Overdue)"}
                {isDueSoon && " (Due Soon)"}
              </span>
            )}

            {task.tags?.map((tag, index) => (
              <span key={index} className="text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete task"
        >
          🗑️
        </button>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                {task.text}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="font-medium text-sm mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Category</h4>
                <span className={cn("px-2 py-1 rounded text-xs", categoryStyle.color, categoryStyle.bgColor)}>
                  {categoryStyle.label}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Priority</h4>
                <span className={cn("text-sm", priorityStyle.color)}>
                  {priorityStyle.icon} {priorityStyle.label}
                </span>
              </div>
            </div>

            {task.due_date && (
              <div>
                <h4 className="font-medium text-sm mb-2">Due Date</h4>
                <span className={cn(
                  "text-sm",
                  isOverdue ? "text-red-600" : isDueSoon ? "text-yellow-600" : ""
                )}>
                  📅 {new Date(task.due_date).toLocaleDateString()}
                  {isOverdue && " (Overdue)"}
                  {isDueSoon && " (Due Soon)"}
                </span>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-sm mb-2">Created</h4>
              <p className="text-sm text-muted-foreground">
                {task.created_at ? new Date(task.created_at).toLocaleString() : 'Unknown'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
