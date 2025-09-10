
"use server";

import { suggestHabits as suggestHabitsFlow } from '@/ai/flows/ai-powered-habit-suggestions';
import type { HabitSuggestionInput } from '@/ai/flows/ai-powered-habit-suggestions';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import type { Habit } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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

// Firestore Habit Actions
const getHabitsCollection = () => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  return collection(db, 'users', auth.currentUser.uid, 'habits');
};

export async function getHabits(): Promise<Habit[]> {
  const habitsCollection = getHabitsCollection();
  const q = query(habitsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
}

export async function addHabit(habitData: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completionDates'>): Promise<Habit> {
  const habitsCollection = getHabitsCollection();
  const newHabit: Omit<Habit, 'id'> = {
    ...habitData,
    streak: 0,
    longestStreak: 0,
    completionDates: {},
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(habitsCollection, newHabit);
  revalidatePath('/');
  return { id: docRef.id, ...newHabit };
}

export async function toggleHabitCompletion(habitId: string): Promise<Habit> {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const habitRef = doc(db, 'users', auth.currentUser.uid, 'habits', habitId);
    const habitSnap = await getDoc(habitRef);
  
    if (!habitSnap.exists()) {
      throw new Error("Habit not found");
    }
  
    const habit = { id: habitSnap.id, ...habitSnap.data() } as Habit;
    const today = new Date().toISOString().split('T')[0];
  
    const newCompletionDates = { ...habit.completionDates };
    if (newCompletionDates[today]) {
      delete newCompletionDates[today];
    } else {
      newCompletionDates[today] = true;
    }
  
    // Recalculate streak
    let currentStreak = 0;
    let tempDate = new Date();
    while (newCompletionDates[tempDate.toISOString().split('T')[0]]) {
      currentStreak++;
      tempDate.setDate(tempDate.getDate() - 1);
    }
  
    const longestStreak = Math.max(habit.longestStreak, currentStreak);
  
    const updatedHabitData = {
      completionDates: newCompletionDates,
      streak: currentStreak,
      longestStreak,
    };
  
    await updateDoc(habitRef, updatedHabitData);
    revalidatePath('/');
    
    return { ...habit, ...updatedHabitData };
}
