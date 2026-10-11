import React, { useState } from 'react';
import { COVER_IMAGE, STORY_TITLE, STORY_SUBTITLE } from '../data/storyData';
import { Play, Volume2, Sparkles, BookOpen, Heart, Eye } from 'lucide-react';
import { speakSingleWord, playTapSound } from '../utils/audio';

interface CoverScreenProps {
  onStartStory: () => void;
  onOpenNotepad: () => void;
  soundEnabled: boolean;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  onStartStory,
  onOpenNotepad,
  soundEnabled,
}) => {
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);

  const introText =
    "Welcome, Feelings Detective! Milo the rabbit was having a picnic in the sunny park. Suddenly, he stopped smiling! Can you follow the clues, discover how Milo feels, and say something kind to help him?";

  const handlePlayIntro = () => {
    if (!soundEnabled) return;
    setIsPlayingIntro(true);
    speakSingleWord(introText, 0.9);
    setTimeout(() => setIsPlayingIntro(false), 9000);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col items-center">
      {/* Top Tagline & Metadata */}
      <div className="flex items-center gap-2 text-xs md:text-sm text-amber-800 font-medium mb-3">
        <span>Elementary Grade 3–4</span>
        <span aria-hidden="true">·</span>
        <span>CEFR Pre-A1 to A1</span>
        <span aria-hidden="true">·</span>
        <span>8 Interactive Pages</span>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-2xl mb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-amber-950 font-serif leading-tight mb-2">
          {STORY_TITLE}
        </h1>
        <p className="text-base md:text-lg text-amber-800 font-medium">
          {STORY_SUBTITLE}
        </p>
      </div>

      {/* Main Storybook Cover Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg shadow-amber-900/5 border border-amber-200/80 overflow-hidden mb-6 flex flex-col">
        {/* Cover Illustration */}
        <div className="relative aspect-[4/3] w-full bg-amber-50 overflow-hidden">
          <img
            src={COVER_IMAGE}
            alt="Milo the rabbit holding a magnifying glass in a sunny park with flowers"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-transparent to-transparent pointer-events-none" />

          {/* Quick Audio Intro Trigger Badge */}
          <button
            onClick={handlePlayIntro}
            className="absolute top-3 right-3 min-h-[44px] px-3.5 py-1.5 bg-white/95 backdrop-blur-sm hover:bg-amber-50 text-amber-900 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            title="Listen to Detective Mission"
          >
            <Volume2 className={`w-4 h-4 text-amber-700 ${isPlayingIntro ? 'animate-bounce' : ''}`} />
            <span>{isPlayingIntro ? 'Reading...' : 'Listen Intro'}</span>
          </button>
        </div>

        {/* Prompt & Call to Action */}
        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 text-amber-900 font-semibold text-lg md:text-xl mb-3">
            <span aria-hidden="true">🔍</span>
            <span>Can you discover why Milo is not smiling?</span>
          </div>

          <p className="text-slate-600 text-sm md:text-base max-w-md mb-6 leading-relaxed">
            Milo suddenly stopped smiling during the school picnic. Listen to the story, search for emotion clues in the pictures, and practice kind words!
          </p>

          <button
            onClick={() => {
              playTapSound();
              onStartStory();
            }}
            className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-3 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Detective Story</span>
          </button>
        </div>
      </div>

      {/* Detective Mission Roadmap (The 4 steps from PRD) */}
      <section className="w-full max-w-xl">
        <h2 className="text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 text-center">
          Detective Learning Flow
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-2">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-950">1. Listen</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Read aloud & words</span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-2">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-950">2. Find Clues</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Emotion Lens</span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-950">3. Guess Feeling</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Milo feels ___ because</span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-2">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-950">4. Say Kind Words</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Empathetic English</span>
          </div>
        </div>
      </section>
    </main>
  );
};
