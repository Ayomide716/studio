
"use client";

import { useState, useEffect } from 'react';
import type { Habit } from '@/lib/types';
import Header from '@/components/header';
import AiHabitSuggester from '@/components/ai-habit-suggester';
import HabitList from '@/components/habit-list';
import AddHabitDialog from '@/components/add-habit-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { addHabit as addHabitAction, getHabits, toggleHabitCompletion } from './actions';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchHabits = async () => {
      if (user) {
        setIsLoaded(false);
        const userHabits = await getHabits();
        setHabits(userHabits);
        setIsLoaded(true);
      }
    };
    fetchHabits();
  }, [user]);

  const addHabit = async (newHabit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completionDates'>) => {
    if (!user) return;
    try {
      const addedHabit = await addHabitAction(newHabit);
      setHabits(prev => [addedHabit, ...prev]);
      toast({
        title: "New Quest Added! ✨",
        description: `Your new quest "${newHabit.name}" has begun.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add quest. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    const originalHabits = [...habits];
    
    // Optimistically update UI
    const today = new Date().toISOString().split('T')[0];
    const habitToUpdate = habits.find(h => h.id === habitId);
    if (!habitToUpdate) return;
    
    const wasCompletedToday = !!habitToUpdate.completionDates[today];
    
    const updatedHabits = habits.map(h => 
      h.id === habitId 
        ? { ...h, completionDates: { ...h.completionDates, [today]: !wasCompletedToday } }
        : h
    );
    setHabits(updatedHabits);

    try {
      const resultHabit = await toggleHabitCompletion(habitId);
      // Update with server state
      setHabits(prev => prev.map(h => h.id === habitId ? resultHabit : h));

       // Milestone achievements
       if (resultHabit.streak > habitToUpdate.streak && [3, 7, 14, 30, 50, 100].includes(resultHabit.streak)) {
        toast({
         title: "Milestone Reached! 🏆",
         description: `You've completed "${resultHabit.name}" for ${resultHabit.streak} days in a row!`,
        });
     }

    } catch (error) {
      // Revert on error
      setHabits(originalHabits);
      toast({
        title: "Error",
        description: "Failed to update quest. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (loading || !isLoaded || !user) {
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
