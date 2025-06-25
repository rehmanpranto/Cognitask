import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
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
            <Link href="/login">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </main>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        Built with ❤️ and ☕
      </footer>
    </div>
  );
}
