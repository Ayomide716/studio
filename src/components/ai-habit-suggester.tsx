"use client";

import { useState } from 'react';
import { Wand2, Plus, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getAIHabitSuggestions } from '@/app/actions';
import type { Habit } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const habitIcons = ['Dumbbell', 'BookOpen', 'BrainCircuit', 'Salad', 'Coffee', 'Code'];
const habitColors = ['#FFA500', '#008080', '#8A2BE2', '#32CD32', '#A0522D', '#4682B4'];

interface AIHabitSuggesterProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completionDates'>) => void;
}

export default function AiHabitSuggester({ onAddHabit }: AIHabitSuggesterProps) {
  const [interests, setInterests] = useState('');
  const [goals, setGoals] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const result = await getAIHabitSuggestions({ interests, goals });

    if (result.error) {
      setError(result.error);
    } else if (result.suggestions) {
      setSuggestions(result.suggestions);
    }

    setIsLoading(false);
  };

  const handleAddSuggestion = (suggestion: string) => {
    onAddHabit({
      name: suggestion,
      description: 'AI Suggested Habit. Edit to add your own description.',
      icon: habitIcons[Math.floor(Math.random() * habitIcons.length)],
      color: habitColors[Math.floor(Math.random() * habitColors.length)],
    });
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center gap-3">
          <Wand2 className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-2xl">Quest Forge</CardTitle>
            <CardDescription>Let AI suggest new quests based on your goals.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interests">Your Interests</Label>
              <Textarea
                id="interests"
                placeholder="e.g., fitness, reading, learning to code"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Your Goals</Label>
              <Textarea
                id="goals"
                placeholder="e.g., lose weight, gain knowledge, build a new skill"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conjuring Quests...
              </>
            ) : (
              <>
                <Wand2 className="mr-2" />
                Suggest Quests
              </>
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
             <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Suggested Quests:</h3>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <span className="font-medium">{suggestion}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddSuggestion(suggestion)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Quest
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
