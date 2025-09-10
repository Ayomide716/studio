
"use client";
import { Target, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';


export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="py-4 px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Habit Quest
          </h1>
        </div>
        {user && (
           <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="mr-2" />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
