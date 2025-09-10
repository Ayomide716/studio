"use server";

import { suggestHabits } from '@/ai/flows/ai-powered-habit-suggestions';
import type { HabitSuggestionInput } from '@/ai/flows/ai-powered-habit-suggestions';

export async function getAIHabitSuggestions(input: HabitSuggestionInput) {
  try {
    const result = await suggestHabits(input);
    if (!result || !result.suggestions) {
       return { error: 'The AI wizard is resting. Please try again later.' };
    }
    return { suggestions: result.suggestions };
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return { error: 'Failed to get suggestions. Please try again.' };
  }
}
