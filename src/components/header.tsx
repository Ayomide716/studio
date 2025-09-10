import { Target } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-3">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Habit Quest
        </h1>
      </div>
    </header>
  );
}
