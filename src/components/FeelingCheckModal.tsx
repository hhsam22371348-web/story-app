import React, { useState } from 'react';
import { FeelingCheckData, FeelingChoice } from '../types/story';
import { Sparkles, CheckCircle2, Volume2, HelpCircle, X, ArrowRight } from 'lucide-react';
import { playSuccessSound, playGentleTryAgainSound, playTapSound, speakSingleWord } from '../utils/audio';

interface FeelingCheckModalProps {
  data: FeelingCheckData;
  onAnswerCorrect: () => void;
  onSentenceCompleted: () => void;
  onClose: () => void;
}

export const FeelingCheckModal: React.FC<FeelingCheckModalProps> = ({
  data,
  onAnswerCorrect,
  onSentenceCompleted,
  onClose,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<FeelingChoice | null>(null);
  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string>('');

  // Sentence builder state
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [sentenceSubmitted, setSentenceSubmitted] = useState(false);
  const [sentenceError, setSentenceError] = useState(false);

  const handleSelectChoice = (choice: FeelingChoice) => {
    setSelectedChoice(choice);
    if (choice.isCorrect) {
      playSuccessSound();
      setHasAnsweredCorrectly(true);
      setFeedbackText(choice.feedback);
      onAnswerCorrect();
      // Auto-populate or leave open for sentence frame
    } else {
      playGentleTryAgainSound();
      setFeedbackText(choice.feedback);
    }
  };

  const handleCheckSentence = () => {
    if (!selectedEmotion || !selectedReason) return;

    if (
      selectedEmotion.toLowerCase() === data.sentenceBuilder.correctEmotion.toLowerCase() &&
      selectedReason.toLowerCase() === data.sentenceBuilder.correctReason.toLowerCase()
    ) {
      playSuccessSound();
      setSentenceSubmitted(true);
      setSentenceError(false);
      onSentenceCompleted();
      // Read aloud the full sentence
      const fullSentence = `Milo feels ${selectedEmotion} because ${selectedReason}.`;
      speakSingleWord(fullSentence, 0.85);
    } else {
      playGentleTryAgainSound();
      setSentenceError(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feeling-check-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-[#FFFDF9] border border-amber-300 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-amber-100/90 px-5 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🧠</span>
            <div>
              <h3 id="feeling-check-title" className="text-base font-bold text-amber-950 font-serif">
                Detective Feeling Check
              </h3>
              <p className="text-xs text-amber-800">
                Understand what Milo is going through
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Feeling Check"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-amber-200/60 text-amber-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Question 1: How does Milo feel? */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {data.question}
              </h4>
            </div>

            {/* 3 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
              {data.choices.map((choice) => {
                const isSelected = selectedChoice?.id === choice.id;
                const isSuccess = isSelected && choice.isCorrect;
                const isFail = isSelected && !choice.isCorrect;

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    className={`min-h-[64px] p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSuccess
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30'
                        : isFail
                        ? 'bg-rose-50 border-rose-300'
                        : isSelected
                        ? 'bg-amber-100 border-amber-400'
                        : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{choice.emoji}</span>
                    <span className="text-sm font-bold text-slate-900">
                      {choice.word}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback */}
            {feedbackText && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                  hasAnsweredCorrectly
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {hasAnsweredCorrectly ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <span>{feedbackText}</span>
              </div>
            )}
          </div>

          {/* Section 2: Sentence Frame "Milo feels ___ because ___" */}
          {hasAnsweredCorrectly && (
            <div className="pt-4 border-t border-amber-200/80 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  Complete the Sentence Frame
                </h4>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Tap words from each box to explain why Milo feels that way:
              </p>

              {/* Live Sentence Display */}
              <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl text-center mb-4">
                <p className="text-base sm:text-lg font-serif font-semibold text-amber-950 flex flex-wrap items-center justify-center gap-1.5">
                  <span>Milo feels</span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-sm font-sans font-bold transition-all ${
                      selectedEmotion
                        ? 'bg-amber-200/90 text-amber-950 border-amber-400'
                        : 'bg-white text-slate-400 border-dashed border-amber-300'
                    }`}
                  >
                    {selectedEmotion || '(emotion)'}
                  </span>
                  <span>because</span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-sm font-sans font-bold transition-all ${
                      selectedReason
                        ? 'bg-amber-200/90 text-amber-950 border-amber-400'
                        : 'bg-white text-slate-400 border-dashed border-amber-300'
                    }`}
                  >
                    {selectedReason || '(reason)'}
                  </span>
                  <span>.</span>
                </p>
              </div>

              {/* Emotion Choices Word Bank */}
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-1.5">
                  1. Pick Emotion:
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.sentenceBuilder.emotionOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        playTapSound();
                        setSelectedEmotion(opt);
                      }}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                        selectedEmotion === opt
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason Choices Word Bank */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-1.5">
                  2. Pick Reason:
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.sentenceBuilder.reasonOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        playTapSound();
                        setSelectedReason(opt);
                      }}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                        selectedReason === opt
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Check Sentence Button */}
              {!sentenceSubmitted ? (
                <button
                  onClick={handleCheckSentence}
                  disabled={!selectedEmotion || !selectedReason}
                  className="w-full min-h-[48px] bg-amber-500 disabled:opacity-50 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Check My Sentence</span>
                </button>
              ) : (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">
                        Sentence Frame Mastered!
                      </p>
                      <p className="text-[11px] text-emerald-800">
                        {data.sentenceBuilder.explanation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      speakSingleWord(
                        `Milo feels ${selectedEmotion} because ${selectedReason}.`,
                        0.85
                      )
                    }
                    className="min-h-[40px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                    title="Listen to full sentence"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>
              )}

              {sentenceError && !sentenceSubmitted && (
                <p className="text-xs text-rose-600 mt-2 text-center font-medium">
                  Almost! Think about what happened to Milo’s food. Try again!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-50/70 border-t border-amber-200 flex items-center justify-end">
          {hasAnsweredCorrectly && sentenceSubmitted ? (
            <button
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="min-h-[44px] px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Continue Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Back to Story
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
