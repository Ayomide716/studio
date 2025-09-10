
"use server";

import { suggestHabits as suggestHabitsFlow } from '@/ai/flows/ai-powered-habit-suggestions';
import type { HabitSuggestionInput } from '@/ai/flows/ai-powered-habit-suggestions';

// AI Habit Suggestions
export async function getAIHabitSuggestions(input: HabitSuggestionInput) {
  try {
    const result = await suggestHabitsFlow(input);
    const suggestions = result.suggestions.map((s: string) => s.replace(/^\d+\.\s*/, '').trim());
    
    if (!suggestions || suggestions.length === 0) {
      return { error: 'The AI wizard is resting. Please try again later.' };
    }
    return { suggestions };
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return { error: 'Failed to get suggestions. The AI may be experiencing issues. Please try again.' };
  }
}
