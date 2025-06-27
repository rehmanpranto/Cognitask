import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function LandingPage() {
  if (typeof window !== 'undefined') {
    window.location.href = '/tasks';
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-5xl font-bold tracking-tighter mb-4">
          Welcome to Cognitask
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl mb-8">
          Structure your thoughts, achieve your goals. Intelligent, streamlined, and powered by AI.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <a href="/tasks">
              Get Started <ArrowRight className="ml-2" />
            </a>
          </Button>
        </div>
      </main>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        Built with ❤️ and ☕
      </footer>
    </div>
  );
}
