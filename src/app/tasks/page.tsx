'use client';

export default function TaskPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 sm:p-8 max-w-3xl">
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Cognitask</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your intelligent task manager. Add a task to get started.
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="flex gap-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="e.g., Finalize project report"
                />
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Add Task
                </button>
              </div>
              <div className="border-t my-4"></div>
              <div className="h-60 overflow-auto">
                <div className="space-y-1 pr-4">
                  <div className="group flex items-center p-1 rounded-md transition-colors duration-200 hover:bg-secondary">
                    <button className="p-2">
                      <div className="w-4 h-4 rounded border-2 border-muted-foreground"></div>
                    </button>
                    <p className="flex-grow px-2 text-base">Complete project documentation</p>
                    <button className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      🗑️
                    </button>
                  </div>
                  <div className="group flex items-center p-1 rounded-md transition-colors duration-200 hover:bg-secondary opacity-60">
                    <button className="p-2">
                      <div className="w-4 h-4 rounded border-2 bg-primary border-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">✓</span>
                      </div>
                    </button>
                    <p className="flex-grow px-2 text-base line-through text-muted-foreground">Review code changes</p>
                    <button className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center p-6 pt-0">
              <p className="text-xs text-muted-foreground">
                2 task(s) • Data stored locally in your browser
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
