# Cognitask: An Intelligent Task Manager

Cognitask is a modern, full-stack task management application designed to help you structure your thoughts and achieve your goals. It combines a clean, minimalist interface with powerful AI features to provide a streamlined and intelligent user experience.

## Core Features

- **CRUD for Tasks**: Full capabilities to create, read, update, and delete your tasks.
- **AI Task Suggestion**: Get intelligent task suggestions based on your current to-do list.
- **AI Task Prioritization**: Let AI automatically re-order your tasks based on their perceived priority.
- **Theme Customization**: Switch between light, dark, and system-default themes for your viewing comfort.
- **Responsive Design**: A seamless experience across desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/) & [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Database**: [Supabase](https://supabase.io/)

## Project Structure

Here is a map of the most important files and directories in the project:

```
.
├── src
│   ├── app
│   │   ├── (main)
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── page.tsx           # Landing page
│   │   └── tasks
│   │       └── page.tsx           # Main task management UI
│   ├── components
│   │   ├── ui/                    # ShadCN UI components
│   │   ├── task-app.tsx           # Core task management component
│   │   ├── theme-provider.tsx     # Theme management
│   │   └── theme-toggle.tsx       # UI for switching themes
│   ├── lib
│   │   ├── actions.ts             # Server Actions (DB operations)
│   │   ├── definitions.ts         # TypeScript type definitions
│   │   └── supabase/              # Supabase client configuration
│   ├── ai
│   │   ├── genkit.ts              # Genkit configuration
│   │   └── flows/                 # Genkit AI flows
│   │       ├── suggest-task.ts
│   │       └── prioritize-tasks.ts
├── public/                        # Static assets (images, etc.)
├── package.json                   # Project dependencies and scripts
└── tailwind.config.ts             # Tailwind CSS configuration
```

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/en) installed on your machine.
- A [Supabase](https://supabase.io/) project.

### 2. Setup Environment Variables

Create a `.env` file in the root of the project and add your Supabase project credentials:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

You can find these in your Supabase project settings under "API".

### 3. Setup Supabase Database

You need to create a `tasks` table in your Supabase database. You can use the following SQL script in the Supabase SQL Editor:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 4. Install Dependencies & Run

Install the necessary packages:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

---

**Note:** This demo version does not require login or authentication. All tasks are shared and visible to anyone who opens the app.

Built with ❤️ and ☕
