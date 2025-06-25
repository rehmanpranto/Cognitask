// src/ai/flows/suggest-task.ts
'use server';
/**
 * @fileOverview A flow to suggest a new task based on the user's existing tasks.
 *
 * - suggestTask - A function that suggests a new task.
 * - SuggestTaskInput - The input type for the suggestTask function.
 * - SuggestTaskOutput - The return type for the suggestTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskInputSchema = z.object({
  existingTasks: z.array(z.string()).describe('The list of existing tasks.'),
});
export type SuggestTaskInput = z.infer<typeof SuggestTaskInputSchema>;

const SuggestTaskOutputSchema = z.object({
  suggestedTask: z.string().describe('The AI-suggested task.'),
});
export type SuggestTaskOutput = z.infer<typeof SuggestTaskOutputSchema>;

export async function suggestTask(input: SuggestTaskInput): Promise<SuggestTaskOutput> {
  return suggestTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskPrompt',
  input: {schema: SuggestTaskInputSchema},
  output: {schema: SuggestTaskOutputSchema},
  prompt: `You are a helpful AI assistant that suggests new tasks to add to a to-do list.

  Given the following existing tasks:
  {{#each existingTasks}}
  - {{{this}}}
  {{/each}}

  Suggest a new task that the user might want to add to their to-do list.  The task should be short and actionable.
  `,
});

const suggestTaskFlow = ai.defineFlow(
  {
    name: 'suggestTaskFlow',
    inputSchema: SuggestTaskInputSchema,
    outputSchema: SuggestTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
