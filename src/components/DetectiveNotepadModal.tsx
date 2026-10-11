import React from 'react';
import { EMOTION_VOCABULARY } from '../data/storyData';
import { X, BookOpen, Volume2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { speakSingleWord, playTapSound } from '../utils/audio';

interface DetectiveNotepadModalProps {
  isOpen: boolean;
  onClose: () => void;
  foundClueIds: string[];
  totalPossibleClues: number;
  feelingScore: number;
  totalFeelingQuestions: number;
  empathyScore: number;
  totalEmpathyQuestions: number;
  sentenceCompleted: boolean;
}

export const DetectiveNotepadModal: React.FC<DetectiveNotepadModalProps> = ({
  isOpen,
  onClose,
  foundClueIds,
  totalPossibleClues,
  feelingScore,
  totalFeelingQuestions,
  empathyScore,
  totalEmpathyQuestions,
  sentenceCompleted,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notepad-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-[#FFFDF9] border border-amber-300 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[88vh]">
        {/* Header */}
        <div className="bg-amber-100/90 px-5 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 id="notepad-title" className="text-base font-bold text-amber-950 font-serif">
                Detective Case Notebook
              </h3>
              <p className="text-xs text-amber-800">
                Case: Milo’s Missing Smile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Notebook"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-amber-200/60 text-amber-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* Progress Overview Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl">
              <span className="text-xs text-amber-800 font-medium block">Clues Found</span>
              <span className="text-lg font-bold text-amber-950 tabular-nums">
                {foundClueIds.length} / {totalPossibleClues}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl">
              <span className="text-xs text-amber-800 font-medium block">Feeling Checks</span>
              <span className="text-lg font-bold text-amber-950 tabular-nums">
                {feelingScore} / {totalFeelingQuestions}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl">
              <span className="text-xs text-amber-800 font-medium block">Kind Words</span>
              <span className="text-lg font-bold text-amber-950 tabular-nums">
                {empathyScore} / {totalEmpathyQuestions}
              </span>
            </div>
          </div>

          {/* Sentence Frame Status */}
          <div className="p-3 bg-amber-100/50 border border-amber-200/80 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-950">
                Formula: “Milo feels ___ because ___”
              </p>
              <p className="text-[11px] text-amber-800">
                {sentenceCompleted
                  ? 'Completed and mastered in story!'
                  : 'Practice this in feeling checks.'}
              </p>
            </div>
            {sentenceCompleted && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
          </div>

          {/* Emotion Words Cards */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-amber-900 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Vocabulary Word Bank</span>
            </h4>
            <div className="space-y-2">
              {EMOTION_VOCABULARY.map((item) => (
                <div
                  key={item.word}
                  className="p-3 bg-white border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {item.word}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.simpleMeaning}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playTapSound();
                      speakSingleWord(item.word, 0.85);
                    }}
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 cursor-pointer transition-colors"
                    title={`Pronounce ${item.word}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-50/70 border-t border-amber-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl cursor-pointer"
          >
            Close Notebook
          </button>
        </div>
      </div>
    </div>
  );
};
