import { getTasks } from '@/lib/actions';
import { TaskApp } from '@/components/task-app';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function TaskPage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user || data.user.id !== userId) {
    redirect('/login');
  }

  const initialTasks = await getTasks(userId);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 sm:p-8 max-w-3xl">
        <TaskApp initialTasks={initialTasks} userId={userId} />
      </main>
    </div>
  );
}
