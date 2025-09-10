"use client";

import { useState, useEffect } from 'react';
import type { Habit } from '@/lib/types';
import Header from '@/components/header';
import AiHabitSuggester from '@/components/ai-habit-suggester';
import HabitList from '@/components/habit-list';
import AddHabitDialog from '@/components/add-habit-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { initialHabits } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHabits = localStorage.getItem('habits');
      // Only set initial habits if nothing is in storage
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      } else if (JSON.parse(storedHabits || '[]').length === 0) {
        setHabits(initialHabits);
      }
    } catch (error) {
      console.error("Failed to load habits from local storage", error);
      setHabits(initialHabits);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Only save to localStorage after the initial load is complete
    if (isLoaded) {
      try {
        localStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error("Failed to save habits to local storage", error);
      }
    }
  }, [habits, isLoaded]);

  const addHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completionDates'>) => {
    const habitToAdd: Habit = {
      ...newHabit,
      id: crypto.randomUUID(),
      streak: 0,
      longestStreak: 0,
      completionDates: {},
    };
    setHabits(prev => [habitToAdd, ...prev]);
    toast({
      title: "New Quest Added! ✨",
      description: `Your new quest "${newHabit.name}" has begun.`
    })
  };
  
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const handleToggleHabit = (habitId: string) => {
    const today = getTodayDateString();
    
    setHabits(prevHabits => {
      const updatedHabits = prevHabits.map(habit => {
        if (habit.id !== habitId) return habit;

        const newCompletionDates = { ...habit.completionDates };
        const wasCompletedToday = !!newCompletionDates[today];
        
        if (wasCompletedToday) {
          delete newCompletionDates[today];
        } else {
          newCompletionDates[today] = true;
        }
        
        // Recalculate streak
        let currentStreak = 0;
        let tempDate = new Date();
        
        // Start checking from today
        while (newCompletionDates[tempDate.toISOString().split('T')[0]]) {
            currentStreak++;
            tempDate.setDate(tempDate.getDate() - 1);
        }
        
        const longestStreak = Math.max(habit.longestStreak, currentStreak);

        // Milestone achievements
        if (currentStreak > habit.streak && [3, 7, 14, 30, 50, 100].includes(currentStreak)) {
           toast({
            title: "Milestone Reached! 🏆",
            description: `You've completed "${habit.name}" for ${currentStreak} days in a row!`,
           });
        }
        
        return {
          ...habit,
          completionDates: newCompletionDates,
          streak: currentStreak,
          longestStreak,
        };
      });
      return updatedHabits;
    });
  };
  
  if (!isLoaded) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div>Loading your quests...</div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 space-y-8">
        <AiHabitSuggester onAddHabit={addHabit} />
        
        <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-headline">Your Quests</h2>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2" />
                New Quest
              </Button>
            </div>
            <HabitList habits={habits} onToggleHabit={handleToggleHabit} />
        </div>

        <AddHabitDialog
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          onAddHabit={addHabit}
        />
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Built for adventure with Habit Quest.
      </footer>
    </div>
  );
}
