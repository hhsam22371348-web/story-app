import React, { useState, useEffect, useMemo } from 'react';
import { StoryPage, ClueItem } from '../types/story';
import {
  Volume2,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Heart,
  HelpCircle,
} from 'lucide-react';
import {
  parseStoryWords,
  speakSentenceWithHighlights,
  speakSingleWord,
  stopSpeech,
  playPageSound,
  playClueSound,
  playSuccessSound,
  playTapSound,
} from '../utils/audio';
import { FeelingCheckModal } from './FeelingCheckModal';
import { EmpathyChoiceModal } from './EmpathyChoiceModal';

interface StoryViewProps {
  pages: StoryPage[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onFinishStory: () => void;
  foundClueIds: string[];
  onClueFound: (clueId: string) => void;
  onFeelingAnswerCorrect: () => void;
  onSentenceCompleted: () => void;
  onEmpathyChoice: (isBest: boolean) => void;
  onOpenNotepad: () => void;
  soundEnabled: boolean;
}

export const StoryView: React.FC<StoryViewProps> = ({
  pages,
  currentPageIndex,
  onPageChange,
  onFinishStory,
  foundClueIds,
  onClueFound,
  onFeelingAnswerCorrect,
  onSentenceCompleted,
  onEmpathyChoice,
  soundEnabled,
}) => {
  const page = pages[currentPageIndex];
  const totalPages = pages.length;

  // Reading audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSlowSpeed, setIsSlowSpeed] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);

  // Modals state
  const [isFeelingCheckOpen, setIsFeelingCheckOpen] = useState(false);
  const [isEmpathyOpen, setIsEmpathyOpen] = useState(false);

  // Emotion Lens state
  const [previewClue, setPreviewClue] = useState<ClueItem | null>(null);
  const [showClueHints, setShowClueHints] = useState(false);

  // Tokenize story text into precise words & sentences
  const parsedStory = useMemo(() => parseStoryWords(page.text), [page.text]);

  // Stop audio on page transition
  useEffect(() => {
    stopSpeech();
    setIsPlayingAudio(false);
    setActiveWordIndex(-1);
    setPreviewClue(null);
    setShowClueHints(false);
  }, [currentPageIndex]);

  // Handle read-aloud with sentence-queued word synchronization
  const handleToggleReadAloud = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      setActiveWordIndex(-1);
      return;
    }

    if (!soundEnabled) return;

    setIsPlayingAudio(true);
    const speed = isSlowSpeed ? 0.8 : 1.0;

    speakSentenceWithHighlights(parsedStory, {
      rate: speed,
      onWordHighlight: (idx) => {
        setActiveWordIndex(idx);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        setActiveWordIndex(-1);
      },
      onError: () => {
        setIsPlayingAudio(false);
        setActiveWordIndex(-1);
      },
    });
  };

  const handleWordTap = (cleanWord: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!soundEnabled) return;
    speakSingleWord(cleanWord, isSlowSpeed ? 0.72 : 0.85);
  };

  const handleNext = () => {
    playPageSound();
    if (currentPageIndex < totalPages - 1) {
      onPageChange(currentPageIndex + 1);
    } else {
      onFinishStory();
    }
  };

  const handlePrev = () => {
    playPageSound();
    if (currentPageIndex > 0) {
      onPageChange(currentPageIndex - 1);
    }
  };

  // Clues logic
  const pageClues = page.clues || [];
  const pageFoundCluesCount = pageClues.filter((c) => foundClueIds.includes(c.id)).length;
  const isAllPageCluesFound = pageClues.length > 0 && pageFoundCluesCount === pageClues.length;

  const handleClueHotspotClick = (clue: ClueItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyFound = foundClueIds.includes(clue.id);

    if (!alreadyFound) {
      playClueSound();
      onClueFound(clue.id);

      // Check if this was the last clue on this page
      const nextFoundCount = pageFoundCluesCount + 1;
      if (nextFoundCount >= pageClues.length) {
        setTimeout(() => {
          playSuccessSound();
        }, 500);
      }
    } else {
      playTapSound();
    }

    setPreviewClue(clue);
  };

  const handleSpeakClueDescription = (description: string) => {
    speakSingleWord(description, 0.88);
  };

  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 md:py-6 flex flex-col items-center">
      {/* Top Status & Activity Strip */}
      <div className="w-full max-w-xl flex items-center justify-between gap-2 mb-3">
        {/* Page progress */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
          <span className="bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-200">
            Page {page.pageNumber} / {totalPages}
          </span>
          <span className="text-slate-600 hidden sm:inline">· {page.title}</span>
        </div>

        {/* Action Triggers based on page features */}
        <div className="flex items-center gap-1.5">
          {page.hasEmotionLens && (
            <button
              onClick={() => {
                playTapSound();
                setShowClueHints(!showClueHints);
              }}
              className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                isAllPageCluesFound
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
              title="Toggle Emotion Lens Clue Hints"
            >
              <Search className="w-3.5 h-3.5" />
              <span>
                {isAllPageCluesFound
                  ? `Clues Solved (${pageFoundCluesCount}/${pageClues.length})`
                  : `Emotion Lens (${pageFoundCluesCount}/${pageClues.length})`}
              </span>
            </button>
          )}

          {page.feelingCheck && (
            <button
              onClick={() => {
                playTapSound();
                setIsFeelingCheckOpen(true);
              }}
              className="min-h-[38px] px-3 py-1 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Feeling Check</span>
            </button>
          )}

          {page.empathyScenario && (
            <button
              onClick={() => {
                playTapSound();
                setIsEmpathyOpen(true);
              }}
              className="min-h-[38px] px-3 py-1 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>What Would You Say?</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Picture Book Stage */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg border border-amber-200/80 overflow-hidden flex flex-col">
        {/* Top Half: Illustration Stage */}
        <div className="relative aspect-[4/3] w-full bg-amber-50/60 overflow-hidden select-none">
          <img
            src={page.illustrationUrl}
            alt={page.illustrationAlt}
            className="w-full h-full object-cover transition-transform duration-500"
            onError={(e) => {
              const target = e.currentTarget;
              // Fallback to static public image if needed
              if (page.pageNumber === 1 && !target.src.endsWith('/images/milo_picnic_happy.jpg')) {
                target.src = '/images/milo_picnic_happy.jpg';
              } else if (page.pageNumber === 7 || page.pageNumber === 8) {
                if (!target.src.endsWith('/images/milo_friends_sharing.jpg')) {
                  target.src = '/images/milo_friends_sharing.jpg';
                }
              } else {
                if (!target.src.endsWith('/images/milo_missing_smile.jpg')) {
                  target.src = '/images/milo_missing_smile.jpg';
                }
              }
            }}
            referrerPolicy="no-referrer"
          />

          {/* Emotion Lens Clue Prompt Overlay Header */}
          {page.hasEmotionLens && (
            <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2">
              <div className="bg-amber-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md">
                <Search className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">
                  {page.emotionLensPrompt || 'Tap the clues on Milo!'}
                </span>
              </div>

              <div
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-md shrink-0 flex items-center gap-1 ${
                  isAllPageCluesFound
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}
              >
                {isAllPageCluesFound ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>
                  {pageFoundCluesCount}/{pageClues.length}
                </span>
              </div>
            </div>
          )}

          {/* Interactive Clue Hotspots on Illustration */}
          {page.hasEmotionLens &&
            pageClues.map((clue, idx) => {
              const isFound = foundClueIds.includes(clue.id);
              return (
                <div
                  key={clue.id}
                  style={{ top: `${clue.yPercent}%`, left: `${clue.xPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <button
                    onClick={(e) => handleClueHotspotClick(clue, e)}
                    aria-label={`Detective Clue: ${clue.title}`}
                    className={`relative min-h-[46px] min-w-[46px] flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer ${
                      isFound
                        ? 'bg-emerald-500 text-white shadow-md ring-4 ring-emerald-300/60'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xl ring-4 ring-amber-300/80 animate-bounce'
                    }`}
                    title={clue.title}
                  >
                    {isFound ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <Search className="w-5 h-5 text-white" />
                    )}

                    {/* Outer Pulsing Wave if not yet found */}
                    {!isFound && (
                      <span className="absolute -inset-2 rounded-full border-2 border-amber-300 animate-ping pointer-events-none opacity-80" />
                    )}
                  </button>

                  {/* Hint indicator if user enabled hint */}
                  {showClueHints && !isFound && (
                    <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-950/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-md pointer-events-none z-30">
                      Clue {idx + 1}: {clue.hint}
                    </div>
                  )}
                </div>
              );
            })}

          {/* Clue Inspector Card (When tapped) */}
          {previewClue && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-amber-300 shadow-xl animate-fade-in flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <span>Clue: {previewClue.title}</span>
                      <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Discovered ✓
                      </span>
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5 leading-snug">
                      {previewClue.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewClue(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-800 p-1 cursor-pointer shrink-0"
                  aria-label="Close clue note"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-[11px]">
                <button
                  onClick={() => handleSpeakClueDescription(previewClue.description)}
                  className="text-amber-800 font-semibold hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Clue Note</span>
                </button>

                {isAllPageCluesFound && page.feelingCheck && (
                  <button
                    onClick={() => {
                      playTapSound();
                      setIsFeelingCheckOpen(true);
                      setPreviewClue(null);
                    }}
                    className="text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Guess Feeling ➔</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* All Clues Found Celebration Banner (if no card open) */}
          {page.hasEmotionLens && isAllPageCluesFound && !previewClue && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 bg-emerald-900/90 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>All clues found on this picture!</span>
              </div>
              {page.feelingCheck && (
                <button
                  onClick={() => {
                    playTapSound();
                    setIsFeelingCheckOpen(true);
                  }}
                  className="px-2.5 py-1 bg-white text-emerald-900 font-bold text-xs rounded-lg shadow-xs hover:bg-emerald-50 cursor-pointer"
                >
                  Guess Feeling ➔
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Half: Story Sentence & Audio Controls */}
        <div className="p-5 md:p-6 flex flex-col justify-between flex-1 bg-[#FFFDF9]">
          {/* Spoken Story Text with Word Highlighting */}
          <div className="mb-6">
            <div
              className="text-lg sm:text-2xl font-serif text-slate-900 leading-relaxed sm:leading-loose tracking-wide select-none"
              aria-label={page.text}
            >
              {parsedStory.tokens.map((token) => {
                const isHighlighted = token.index === activeWordIndex;
                return (
                  <span
                    key={`token-${token.index}-${token.word}`}
                    onClick={(e) => handleWordTap(token.cleanWord, e)}
                    className={`inline-block mr-1.5 px-1.5 py-0.5 rounded-md cursor-pointer transition-colors duration-75 select-none ${
                      isHighlighted
                        ? 'bg-amber-300 text-amber-950 font-bold shadow-xs ring-2 ring-amber-400'
                        : 'text-slate-900 hover:bg-amber-100/60'
                    }`}
                    title="Tap to hear this word"
                  >
                    {token.word}
                  </span>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Tip: Tap any word to hear it pronounced!
            </p>
          </div>

          {/* Audio Controls Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-amber-200/60">
            {/* Listen button & Speed toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleReadAloud}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isPlayingAudio
                    ? 'bg-amber-600 text-white animate-pulse ring-2 ring-amber-300'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? 'Listening...' : 'Listen'}</span>
              </button>

              <button
                onClick={() => {
                  playTapSound();
                  setIsSlowSpeed(!isSlowSpeed);
                }}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSlowSpeed
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                    : 'bg-white border-amber-200 text-slate-600 hover:bg-amber-50'
                }`}
                title={isSlowSpeed ? 'Slow reading mode on' : 'Normal reading mode'}
              >
                {isSlowSpeed ? '🐢 Slow (0.8x)' : '🐰 Normal (1.0x)'}
              </button>
            </div>

            {/* Quick Detective Activities Trigger Buttons */}
            <div className="flex items-center gap-2">
              {page.feelingCheck && (
                <button
                  onClick={() => {
                    playTapSound();
                    setIsFeelingCheckOpen(true);
                  }}
                  className="min-h-[44px] px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl border border-amber-300/80 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Milo's Feeling?</span>
                </button>
              )}

              {page.hasEmotionLens && !isAllPageCluesFound && (
                <button
                  onClick={() => {
                    playTapSound();
                    setShowClueHints(!showClueHints);
                  }}
                  className="min-h-[44px] px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 cursor-pointer flex items-center gap-1"
                  title="Show clue hints"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Hints</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="w-full max-w-xl flex items-center justify-between mt-4 px-1">
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          className="min-h-[44px] px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Page progress dot indicators */}
        <div className="flex items-center gap-1.5">
          {pages.map((p, idx) => (
            <button
              key={p.pageNumber}
              onClick={() => {
                playPageSound();
                onPageChange(idx);
              }}
              aria-label={`Jump to page ${p.pageNumber}`}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                idx === currentPageIndex
                  ? 'bg-amber-500 scale-125'
                  : 'bg-amber-200 hover:bg-amber-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="min-h-[44px] px-5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1 transition-all"
        >
          <span>{currentPageIndex === totalPages - 1 ? 'Finish Mystery' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modals for Feeling Check & What Would You Say */}
      {isFeelingCheckOpen && page.feelingCheck && (
        <FeelingCheckModal
          data={page.feelingCheck}
          onAnswerCorrect={onFeelingAnswerCorrect}
          onSentenceCompleted={onSentenceCompleted}
          onClose={() => setIsFeelingCheckOpen(false)}
        />
      )}

      {isEmpathyOpen && page.empathyScenario && (
        <EmpathyChoiceModal
          scenario={page.empathyScenario}
          onChoiceMade={onEmpathyChoice}
          onClose={() => setIsEmpathyOpen(false)}
        />
      )}
    </main>
  );
};
