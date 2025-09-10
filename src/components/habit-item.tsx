
"use client";

import { Flame, Star, Copy, Check, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Habit } from '@/lib/types';
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface HabitItemProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const DynamicIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <LucideIcons.Target {...props} />; // Fallback icon
  }
  return <IconComponent {...props} />;
};

export default function HabitItem({ habit, isCompletedToday, onToggle, onDelete }: HabitItemProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const totalCompletions = Object.keys(habit.completionDates).length;
  const goal = habit.duration || 30;
  const progressPercentage = (totalCompletions / goal) * 100;

  const handleShare = () => {
    const shareText = `I'm on a ${habit.streak}-day streak for my habit "${habit.name}" in Habit Quest! My longest streak is ${habit.longestStreak} days. #HabitQuest`;
    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    toast({ title: 'Copied to clipboard!', description: 'Share your amazing progress.' });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: habit.color, color: 'white' }}>
              <DynamicIcon name={habit.icon} className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="font-headline">{habit.name}</CardTitle>
              <CardDescription>{habit.description}</CardDescription>
            </div>
          </div>
          <Button
            variant={isCompletedToday ? "default" : "outline"}
            size="icon"
            onClick={() => onToggle(habit.id)}
            aria-label={isCompletedToday ? "Mark as not complete" : "Mark as complete"}
            className={`w-10 h-10 rounded-full shrink-0 transition-all duration-300 ${isCompletedToday ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
          >
            <Check className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="text-sm text-muted-foreground">Overall Progress</div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="text-xs text-right mt-1 text-muted-foreground">{totalCompletions} / {goal} days</div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm bg-background/50 rounded-b-lg p-3">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 font-semibold" title="Current Streak">
            <Flame className="w-5 h-5 text-primary" />
            <span>{habit.streak}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground" title="Longest Streak">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>{habit.longestStreak}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              {isCopied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
              Share
            </Button>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 w-8 h-8">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to abandon this quest?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All progress for "{habit.name}" will be permanently lost.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(habit.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
