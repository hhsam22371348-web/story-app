import React, { useState, useRef } from 'react';
import { EMOTION_VOCABULARY, MODEL_PRACTICE_PHRASES } from '../data/storyData';
import {
  Award,
  RotateCcw,
  Volume2,
  Mic,
  Square,
  Play,
  CheckCircle2,
  Sparkles,
  Heart,
  Star,
  BookOpen
} from 'lucide-react';
import { speakSingleWord, playSuccessSound, playTapSound } from '../utils/audio';

interface ResultScreenProps {
  feelingScore: number;
  totalFeelingQuestions: number;
  empathyScore: number;
  totalEmpathyQuestions: number;
  foundCluesCount: number;
  totalCluesCount: number;
  sentenceCompleted: boolean;
  onReadAgain: () => void;
  onOpenNotepad: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  feelingScore,
  totalFeelingQuestions,
  empathyScore,
  totalEmpathyQuestions,
  foundCluesCount,
  totalCluesCount,
  sentenceCompleted,
  onReadAgain,
  onOpenNotepad,
}) => {
  // Voice reflection state
  const [selectedPhrase, setSelectedPhrase] = useState(MODEL_PRACTICE_PHRASES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setRecordingError(null);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingError('Microphone not supported on this device/browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setHasRecordedOnce(true);
        playSuccessSound();

        // Stop tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError('Could not access microphone. Please allow microphone permission.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayModel = (sentence: string) => {
    speakSingleWord(sentence, 0.85);
  };

  // Calculate detective stars (max 5)
  const isMaster = feelingScore >= 3 && empathyScore >= 1 && sentenceCompleted;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
      {/* Celebration Header */}
      <div className="text-center max-w-xl mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 mb-3 shadow-xs">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-amber-950 font-serif leading-tight mb-2">
          Mystery Solved!
        </h1>
        <p className="text-sm md:text-base text-amber-800 font-medium">
          You discovered why Milo was sad and helped bring his big smile back!
        </p>
      </div>

      {/* Detective Case Summary Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-amber-200/80 p-6 md:p-8 mb-8">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-amber-950">
              Detective Performance Report
            </h2>
            <p className="text-xs text-slate-500">
              Case #01: Milo’s Missing Smile
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            {isMaster && <Star className="w-5 h-5 fill-current animate-pulse" />}
          </div>
        </div>

        {/* 4 Score Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-center">
            <span className="text-xs text-amber-800 block">Emotion Clues</span>
            <span className="text-xl font-bold text-amber-950 tabular-nums">
              {foundCluesCount} / {totalCluesCount}
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-center">
            <span className="text-xs text-amber-800 block">Feeling Checks</span>
            <span className="text-xl font-bold text-amber-950 tabular-nums">
              {feelingScore} / {totalFeelingQuestions}
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-center">
            <span className="text-xs text-amber-800 block">Kind Responses</span>
            <span className="text-xl font-bold text-amber-950 tabular-nums">
              {empathyScore} / {totalEmpathyQuestions}
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-center">
            <span className="text-xs text-amber-800 block">Sentence Frame</span>
            <span className="text-xl font-bold text-emerald-700">
              {sentenceCompleted ? 'Mastered ✓' : 'Practice'}
            </span>
          </div>
        </div>

        {/* Emotion Words Learned Review Cards */}
        <div className="mb-8">
          <h3 className="text-xs uppercase font-bold tracking-wider text-amber-900 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Emotion Words Mastered Today (Tap to hear)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {EMOTION_VOCABULARY.map((v) => (
              <button
                key={v.word}
                onClick={() => {
                  playTapSound();
                  speakSingleWord(v.word, 0.85);
                }}
                className="p-3 bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{v.emoji}</span>
                  <div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-amber-950">
                      {v.word}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {v.simpleMeaning}
                    </p>
                  </div>
                </div>
                <div className="p-1.5 rounded-lg text-amber-700 group-hover:text-amber-900 shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Reflection Studio */}
        <div className="pt-6 border-t border-amber-200/80">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-amber-950">
              Voice Reflection: Speak Like an Empathy Detective
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Listen to a model sentence, practice with your own voice, and replay it!
          </p>

          {/* Model Sentence Selector */}
          <div className="space-y-2 mb-4">
            {MODEL_PRACTICE_PHRASES.map((phrase) => {
              const isSelected = selectedPhrase.id === phrase.id;
              return (
                <div
                  key={phrase.id}
                  onClick={() => setSelectedPhrase(phrase)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-300'
                      : 'bg-white border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {phrase.sentence}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {phrase.meaning}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayModel(phrase.sentence);
                    }}
                    className="min-h-[40px] px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Listen to model voice"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Model</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Audio Recorder Controls */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="min-h-[46px] px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  <span>Record My Voice</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="min-h-[46px] px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer animate-pulse"
                >
                  <Square className="w-4 h-4 text-rose-400 fill-current" />
                  <span>Stop Recording</span>
                </button>
              )}

              {recordedAudioUrl && (
                <audio
                  src={recordedAudioUrl}
                  controls
                  className="h-10 max-w-[240px]"
                />
              )}
            </div>

            {hasRecordedOnce && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Great speaking practice, Detective!</span>
              </div>
            )}

            {recordingError && (
              <p className="text-xs text-rose-600 mt-2">
                {recordingError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            playTapSound();
            onReadAgain();
          }}
          className="min-h-[48px] px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Read Again</span>
        </button>

        <button
          onClick={onOpenNotepad}
          className="min-h-[48px] px-5 py-2.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 font-semibold text-sm rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>View Detective Notebook</span>
        </button>
      </div>
    </main>
  );
};
