import React from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => (
  <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">MetaTags<span className="text-blue-600">Pro</span></span>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  </header>
);
