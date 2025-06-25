// prioritize-tasks.ts
'use server';
/**
 * @fileOverview AI-powered task prioritization flow.
 *
 * - prioritizeTasks - A function that reorganizes tasks by estimated priority.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTasksInputSchema = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
  })
).describe('An array of task objects, each with an id, text, and completed status.');
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizeTasksOutputSchema = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
  })
).describe('An array of task objects reordered by priority.');
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are a task management assistant. Reorder the following list of tasks by priority, with the most important tasks at the top. Return the tasks in the same format as the input.

Tasks:
{{#each this}}
- {{this.text}} (ID: {{this.id}}, Completed: {{this.completed}})
{{/each}}`,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
