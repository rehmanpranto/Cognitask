import { getTasks } from '@/lib/actions';
import { TaskApp } from '@/components/task-app';

export default async function TaskPage() {
  const initialTasks = await getTasks();
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 sm:p-8 max-w-3xl">
        <TaskApp initialTasks={initialTasks} />
      </main>
    </div>
  );
}
