
'use server';

/**
 * @fileOverview AI-powered habit suggestions flow.
 *
 * This file defines a Genkit flow that suggests personalized habits to users based on their interests and goals.
 * It includes the `suggestHabits` function, input/output schemas, a prompt definition, and the flow itself.
 *
 * @remarks
 * - suggestHabits - The main function to trigger the habit suggestion flow.
 * - HabitSuggestionInput - The input type for the suggestHabits function, defining the user's interests and goals.
 * - HabitSuggestionOutput - The output type for the suggestHabits function, providing a list of suggested habits.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the habit suggestion flow
const HabitSuggestionInputSchema = z.object({
  interests: z
    .string()
    .describe('A description of the users interests e.g. fitness, reading, cooking'),
  goals: z
    .string()
    .describe('A description of the users goals e.g. lose weight, gain knowledge, improve skills'),
});
export type HabitSuggestionInput = z.infer<typeof HabitSuggestionInputSchema>;

// Define the output schema for the habit suggestion flow
const HabitSuggestionOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of 3 concise, actionable habit suggestions as strings.'),
});
export type HabitSuggestionOutput = z.infer<typeof HabitSuggestionOutputSchema>;

// Exported function to call the flow
export async function suggestHabits(input: HabitSuggestionInput): Promise<HabitSuggestionOutput> {
  return suggestHabitsFlow(input);
}

// Define the prompt for the habit suggestion
const habitSuggestionPrompt = ai.definePrompt({
  name: 'habitSuggestionPrompt',
  input: {schema: HabitSuggestionInputSchema},
  output: {schema: HabitSuggestionOutputSchema},
  prompt: `Based on the user's interests and goals, generate a list of exactly 3 concise, actionable habit suggestions.

  Interests: {{{interests}}}
  Goals: {{{goals}}}
  `,
});

// Define the Genkit flow for habit suggestion
const suggestHabitsFlow = ai.defineFlow(
  {
    name: 'suggestHabitsFlow',
    inputSchema: HabitSuggestionInputSchema,
    outputSchema: HabitSuggestionOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({
      prompt: habitSuggestionPrompt.prompt,
      input,
      model: 'googleai/gemini-2.5-flash',
      output: {
        schema: HabitSuggestionOutputSchema,
      },
    });

    return llmResponse.output() || { suggestions: [] };
  }
);
