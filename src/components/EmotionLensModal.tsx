import React, { useState } from 'react';
import { ClueItem } from '../types/story';
import { Search, CheckCircle2, Sparkles, X, Info } from 'lucide-react';
import { playClueSound, playTapSound } from '../utils/audio';

interface EmotionLensModalProps {
  prompt: string;
  clues: ClueItem[];
  foundClueIds: string[];
  onClueFound: (clueId: string) => void;
  onClose: () => void;
  onProceedToFeelingCheck?: () => void;
  hasFeelingCheck: boolean;
}

export const EmotionLensModal: React.FC<EmotionLensModalProps> = ({
  prompt,
  clues,
  foundClueIds,
  onClueFound,
  onClose,
  onProceedToFeelingCheck,
  hasFeelingCheck,
}) => {
  const [activeClueDetail, setActiveClueDetail] = useState<ClueItem | null>(null);

  const allFound = clues.every((c) => foundClueIds.includes(c.id));

  const handleTapClue = (clue: ClueItem) => {
    if (!foundClueIds.includes(clue.id)) {
      playClueSound();
      onClueFound(clue.id);
    } else {
      playTapSound();
    }
    setActiveClueDetail(clue);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emotion-lens-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-[#FFFDF9] border border-amber-300 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-100/80 px-5 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 id="emotion-lens-title" className="text-base font-bold text-amber-950 font-serif">
                Emotion Lens: Find Clues!
              </h3>
              <p className="text-xs text-amber-800">
                Found {foundClueIds.length} of {clues.length} clues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Emotion Lens"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-amber-200/60 text-amber-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-200/50 text-center">
          <p className="text-sm font-medium text-amber-900">
            {prompt}
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            {clues.map((clue, idx) => {
              const isFound = foundClueIds.includes(clue.id);
              return (
                <div
                  key={clue.id}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isFound
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-200/50 text-amber-800 border border-amber-300/60'
                  }`}
                >
                  {isFound ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Search className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>Clue {idx + 1} {isFound ? 'Found' : 'Searching'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clue interactive selection buttons */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <p className="text-xs text-slate-500 text-center">
            Tap a clue area to inspect what is happening to Milo:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clues.map((clue, idx) => {
              const isFound = foundClueIds.includes(clue.id);
              return (
                <button
                  key={clue.id}
                  onClick={() => handleTapClue(clue)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[92px] ${
                    isFound
                      ? 'bg-emerald-50/80 border-emerald-300 hover:bg-emerald-100/70 shadow-xs'
                      : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-amber-900">
                      Clue #{idx + 1}
                    </span>
                    {isFound ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Search className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {clue.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hint: {clue.hint}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Clue detail inspection card */}
          {activeClueDetail && (
            <div className="mt-4 p-4 rounded-2xl bg-white border border-amber-300 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Detective Discovery: {activeClueDetail.title}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeClueDetail.description}
              </p>
            </div>
          )}

          {allFound && (
            <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  All clues found on this page!
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  You discovered why Milo is not smiling. Ready to check his feelings?
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-50/60 border-t border-amber-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Keep Looking
          </button>

          {allFound && hasFeelingCheck && onProceedToFeelingCheck ? (
            <button
              onClick={() => {
                playTapSound();
                onProceedToFeelingCheck();
              }}
              className="min-h-[44px] px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Guess Milo's Feeling</span>
              <span aria-hidden="true">➔</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl cursor-pointer"
            >
              Close Lens
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
