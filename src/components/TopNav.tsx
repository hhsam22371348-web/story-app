import React from 'react';
import { BookOpen, Search, Volume2, VolumeX } from 'lucide-react';

interface TopNavProps {
  currentView: 'cover' | 'story' | 'results';
  onNavigateCover: () => void;
  onNavigateStory: () => void;
  onOpenNotepad: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentPage: number;
  totalPages: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigateCover,
  onNavigateStory,
  onOpenNotepad,
  soundEnabled,
  onToggleSound,
  currentPage,
  totalPages,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-200/70 px-4 md:px-8 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title, single line */}
        <button
          onClick={onNavigateCover}
          className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          aria-label="Return to Cover"
        >
          <span className="text-xl md:text-2xl font-bold tracking-tight text-amber-950 font-serif whitespace-nowrap shrink-0 group-hover:text-amber-800 transition-colors">
            Feelings Detective!
          </span>
          <span className="text-lg" aria-hidden="true">🔍</span>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={onNavigateCover}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-amber-900 ${
              currentView === 'cover' ? 'text-amber-900 font-semibold underline decoration-amber-500 decoration-2 underline-offset-4' : ''
            }`}
          >
            Cover
          </button>
          <button
            onClick={onNavigateStory}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-amber-900 ${
              currentView === 'story' ? 'text-amber-900 font-semibold underline decoration-amber-500 decoration-2 underline-offset-4' : ''
            }`}
          >
            Story {currentView === 'story' ? `(Page ${currentPage}/${totalPages})` : ''}
          </button>
          <button
            onClick={onOpenNotepad}
            className="cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-amber-900 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            Detective Notes
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          <button
            onClick={onOpenNotepad}
            className="min-h-[44px] px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 whitespace-nowrap shrink-0"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xs:inline">Clue Notes</span>
          </button>
        </div>
      </div>
    </header>
  );
};
