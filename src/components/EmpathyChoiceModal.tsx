import React, { useState } from 'react';
import { EmpathyScenario, EmpathyChoice } from '../types/story';
import { Heart, MessageCircle, CheckCircle2, AlertCircle, ArrowRight, X, Volume2 } from 'lucide-react';
import { playSuccessSound, playGentleTryAgainSound, playTapSound, speakSingleWord } from '../utils/audio';

interface EmpathyChoiceModalProps {
  scenario: EmpathyScenario;
  onChoiceMade: (isBest: boolean) => void;
  onClose: () => void;
}

export const EmpathyChoiceModal: React.FC<EmpathyChoiceModalProps> = ({
  scenario,
  onChoiceMade,
  onClose,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<EmpathyChoice | null>(null);
  const [hasChosenKind, setHasChosenKind] = useState(false);

  const handleSelect = (choice: EmpathyChoice) => {
    setSelectedChoice(choice);
    if (choice.isBest) {
      playSuccessSound();
      setHasChosenKind(true);
      onChoiceMade(true);
    } else {
      playGentleTryAgainSound();
      onChoiceMade(false);
    }
  };

  const handleSpeakMilo = () => {
    speakSingleWord(scenario.miloSpeech, 0.85);
  };

  const handleSpeakChoice = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakSingleWord(text, 0.9);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="empathy-choice-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-[#FFFDF9] border border-amber-300 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-amber-100/90 px-5 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 id="empathy-choice-title" className="text-base font-bold text-amber-950 font-serif">
                What Would You Say?
              </h3>
              <p className="text-xs text-amber-800">
                Practice kind and caring words in English
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Empathy Activity"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-amber-200/60 text-amber-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Milo's Character & Speech Bubble */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            {/* Milo's dynamic avatar */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white border border-amber-300 flex items-center justify-center text-3xl shadow-xs transition-transform duration-300">
                {selectedChoice ? selectedChoice.miloExpressionEmoji : '🐰😢'}
              </div>
              <span className="text-[11px] font-bold text-amber-950 mt-1">Milo</span>
            </div>

            {/* Speech bubble */}
            <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-xs border border-amber-200 shadow-xs relative">
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                {selectedChoice
                  ? selectedChoice.miloReactionText
                  : scenario.miloSpeech}
              </p>
              <button
                onClick={handleSpeakMilo}
                className="mt-2 text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Milo</span>
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2.5">
              {scenario.prompt}
            </h4>

            {/* 3 Response Choices */}
            <div className="space-y-2.5">
              {scenario.choices.map((choice) => {
                const isSelected = selectedChoice?.id === choice.id;
                const isKind = isSelected && choice.isBest;
                const isNotKind = isSelected && !choice.isBest;

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelect(choice)}
                    className={`w-full min-h-[58px] p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isKind
                        ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-300/40 shadow-xs'
                        : isNotKind
                        ? 'bg-amber-50/90 border-amber-300'
                        : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <MessageCircle
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isKind ? 'text-rose-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="text-sm font-medium text-slate-900 leading-snug">
                        {choice.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleSpeakChoice(choice.text, e)}
                        className="p-1 rounded-lg hover:bg-amber-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                        title="Listen to option"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      {isKind && (
                        <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      {isNotKind && (
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Card */}
          {selectedChoice && (
            <div
              className={`p-3.5 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
                selectedChoice.isBest
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {selectedChoice.isBest ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Empathy Master!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Let’s think about Milo’s feelings...</span>
                  </>
                )}
              </div>
              <p>{selectedChoice.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-50/70 border-t border-amber-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Review Page
          </button>

          {hasChosenKind ? (
            <button
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="min-h-[44px] px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Continue with Milo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-amber-800 font-medium italic">
              Pick the kindest response to help Milo!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
