
export interface Habit {
  id: string;
  name: string;
  description: string;
  streak: number;
  longestStreak: number;
  // A record of completion dates, e.g., { '2024-05-21': true }
  completionDates: Record<string, boolean>; 
  icon: string;
  color: string;
  duration: number; // Duration of the habit in days
  createdAt?: string; // Optional: for sorting
}
