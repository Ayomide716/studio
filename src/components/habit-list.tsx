"use client";

import type { Habit } from '@/lib/types';
import HabitItem from './habit-item';

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export default function HabitList({ habits, onToggleHabit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12 px-6 rounded-lg bg-card border-2 border-dashed">
        <h3 className="text-xl font-semibold text-foreground">No Quests Yet!</h3>
        <p className="text-muted-foreground mt-2">
          Click on "New Quest" or use the Quest Forge to start your adventure.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map(habit => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={onToggleHabit}
          isCompletedToday={!!habit.completionDates[getTodayDateString()]}
        />
      ))}
    </div>
  );
}
