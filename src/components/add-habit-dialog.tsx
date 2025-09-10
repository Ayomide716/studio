"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Habit } from "@/lib/types";
import { useState } from "react";
import * as LucideIcons from 'lucide-react';

interface AddHabitDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completionDates'>) => void;
}

const icons = ['Dumbbell', 'BookOpen', 'BrainCircuit', 'Salad', 'Coffee', 'Code', 'Heart', 'TrendingUp', 'Wind', 'Palette'];
const colors = ['#FFA500', '#008080', '#8A2BE2', '#32CD32', '#A0522D', '#4682B4', '#FF6347', '#40E0D0'];

export default function AddHabitDialog({ isOpen, setIsOpen, onAddHabit }: AddHabitDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddHabit({ name, description, icon: selectedIcon, color: selectedColor });
    
    setName('');
    setDescription('');
    setSelectedIcon(icons[0]);
    setSelectedColor(colors[0]);
    setIsOpen(false);
  };

  const DynamicIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent {...props} /> : null;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Quest</DialogTitle>
          <DialogDescription>
            Define your new daily quest. Make it clear and achievable.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Quest Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Drink 8 glasses of water" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of your quest" />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {icons.map(icon => (
                  <Button
                    key={icon}
                    type="button"
                    variant={selectedIcon === icon ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setSelectedIcon(icon)}
                  >
                    <DynamicIcon name={icon} className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
             <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{ backgroundColor: color, borderColor: selectedColor === color ? 'hsl(var(--primary))' : 'transparent' }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Add Quest</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
