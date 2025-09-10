import type { Habit } from './types';

const generateCompletionDates = (days: number): Record<string, boolean> => {
  const dates: Record<string, boolean> = {};
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates[date.toISOString().split('T')[0]] = true;
  }
  return dates;
};

export const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Run',
    description: 'Run for 20 minutes every morning.',
    icon: 'Flame',
    color: '#FFA500',
    streak: 5,
    longestStreak: 12,
    completionDates: generateCompletionDates(5),
  },
  {
    id: '2',
    name: 'Read a Chapter',
    description: 'Read one chapter of a book.',
    icon: 'BookOpen',
    color: '#008080',
    streak: 15,
    longestStreak: 15,
    completionDates: generateCompletionDates(15),
  },
  {
    id: '3',
    name: 'Meditate',
    description: '5 minutes of guided meditation.',
    icon: 'BrainCircuit',
    color: '#8A2BE2',
    streak: 0,
    longestStreak: 3,
    completionDates: {},
  },
];
