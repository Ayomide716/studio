
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Habit } from '@/lib/types';
import Header from '@/components/header';
import AiHabitSuggester from '@/components/ai-habit-suggester';
import HabitList from '@/components/habit-list';
import AddHabitDialog from '@/components/add-habit-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, getDoc, query, orderBy } from 'firebase/firestore';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const getHabits = useCallback(async (userId: string): Promise<Habit[]> => {
    const habitsCollection = collection(db, 'users', userId, 'habits');
    const q = query(habitsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchHabits = async () => {
      if (user && !isDataLoaded) {
        try {
          const userHabits = await getHabits(user.uid);
          setHabits(userHabits);
        } catch (error) {
            console.error("Failed to fetch habits:", error);
            toast({
                title: "Error",
                description: "Could not load your quests. Please try again later.",
                variant: "destructive"
            });
        } finally {
          setIsDataLoaded(true);
        }
      }
    };

    if (!authLoading && user) {
        fetchHabits();
    }
  }, [user, authLoading, router, isDataLoaded, toast, getHabits]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completionDates'>) => {
    if (!user) return;
    try {
      const habitsCollection = collection(db, 'users', user.uid, 'habits');
      const newHabit: Omit<Habit, 'id'> = {
        ...habitData,
        streak: 0,
        longestStreak: 0,
        completionDates: {},
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(habitsCollection, newHabit);
      const addedHabit = { id: docRef.id, ...newHabit };

      setHabits(prev => [addedHabit, ...prev]);
      toast({
        title: "New Quest Added! ✨",
        description: `Your new quest "${habitData.name}" has begun.`
      });
    } catch (error) {
      console.error("Failed to add habit:", error);
      toast({
        title: "Error",
        description: "Failed to add quest. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    if (!user) return;
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
        const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
        const habitSnap = await getDoc(habitRef);
      
        if (!habitSnap.exists()) {
          throw new Error("Habit not found");
        }
      
        const habit = { id: habitSnap.id, ...habitSnap.data() } as Habit;
      
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
        
        const resultHabit = { ...habit, ...updatedHabitData };
        
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
      console.error("Failed to toggle habit:", error);
      // Revert on error
      setHabits(originalHabits);
      toast({
        title: "Error",
        description: "Failed to update quest. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (authLoading || !user || !isDataLoaded) {
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
