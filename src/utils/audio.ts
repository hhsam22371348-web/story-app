/**
 * Audio synthesis & Web Speech API helper for Feelings Detective!
 * Completely client-side, with snappy, real-time word-synchronized speech playback.
 */

// Web Audio API context singleton
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a sparkling detective chime when a clue is found
 */
export function playClueSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
  });
}

/**
 * Play celebration fanfare when a feeling check or empathy choice is correct
 */
export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [
    { freq: 440, delay: 0 },
    { freq: 554.37, delay: 0.05 },
    { freq: 659.25, delay: 0.1 },
    { freq: 880, delay: 0.18 },
  ];

  chords.forEach((c) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(c.freq, ctx.currentTime + c.delay);

    gain.gain.setValueAtTime(0.001, ctx.currentTime + c.delay);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + c.delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + c.delay + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + c.delay);
    osc.stop(ctx.currentTime + c.delay + 0.55);
  });
}

/**
 * Play gentle page flip sound
 */
export function playPageSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.13);
}

/**
 * Play a light tap feedback sound
 */
export function playTapSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.07);
}

/**
 * Play gentle retry sound
 */
export function playGentleTryAgainSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(349.23, ctx.currentTime); // F4
  osc.frequency.linearRampToValueAtTime(311.13, ctx.currentTime + 0.15); // Eb4

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.26);
}

// ==========================================
// Precise Story Tokenizer & Word Highlighting
// ==========================================

export interface StoryWordToken {
  index: number;
  word: string;
  cleanWord: string;
  sentenceIndex: number;
  charStartInSentence: number;
  charEndInSentence: number;
}

export interface ParsedStoryData {
  tokens: StoryWordToken[];
  sentences: {
    sentenceText: string;
    startIndex: number;
    endIndex: number;
  }[];
}

/**
 * Tokenize story page text into precise sentence and word units.
 */
export function parseStoryWords(fullText: string): ParsedStoryData {
  const rawSentences = fullText.match(/[^.!?]+[.!?]+["'”]?|[^.!?]+$/g) || [fullText];
  const tokens: StoryWordToken[] = [];
  const sentences: ParsedStoryData['sentences'] = [];

  let globalTokenIndex = 0;

  rawSentences.forEach((rawSentence, sIdx) => {
    const trimmedSentence = rawSentence.trim();
    if (!trimmedSentence) return;

    const sentenceStartIndex = globalTokenIndex;
    const wordRegex = /\S+/g;
    let match: RegExpExecArray | null;

    while ((match = wordRegex.exec(trimmedSentence)) !== null) {
      const rawWord = match[0];
      const clean = rawWord.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'“”]/g, '');

      tokens.push({
        index: globalTokenIndex,
        word: rawWord,
        cleanWord: clean || rawWord,
        sentenceIndex: sIdx,
        charStartInSentence: match.index,
        charEndInSentence: match.index + rawWord.length,
      });

      globalTokenIndex++;
    }

    sentences.push({
      sentenceText: trimmedSentence,
      startIndex: sentenceStartIndex,
      endIndex: globalTokenIndex - 1,
    });
  });

  return { tokens, sentences };
}

// Calculate realistic spoken duration in ms for a word based on character length and punctuation
function estimateWordDuration(cleanWord: string, hasPunctuation: boolean, rate: number): number {
  const len = cleanWord.length;
  let baseMs = 190;

  if (len <= 2) {
    baseMs = 140; // in, is, to, he, on
  } else if (len <= 4) {
    baseMs = 190; // the, park, Milo, look
  } else if (len <= 6) {
    baseMs = 240; // happy, sunny, smile, bench
  } else if (len <= 8) {
    baseMs = 290; // picnic, rabbit, crying, friends
  } else {
    baseMs = 360; // strawberry, completely, lunchbox
  }

  if (hasPunctuation) {
    baseMs += 100; // brief pause on comma, period, exclamation
  }

  return Math.round(baseMs / Math.max(0.5, rate));
}

// ==========================================
// Text To Speech (TTS) Snappy Engine
// ==========================================

export interface SpeakOptions {
  rate?: number; // 0.8 for slow, 1.0 for normal
  onWordHighlight?: (wordIndex: number) => void;
  onEnd?: () => void;
  onError?: () => void;
}

let activeSpeechController: { cancel: () => void } | null = null;

export function stopSpeech() {
  if (activeSpeechController) {
    activeSpeechController.cancel();
    activeSpeechController = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speaks text sentence-by-sentence with snappy, real-time word highlighting.
 */
export function speakSentenceWithHighlights(
  parsed: ParsedStoryData,
  options: SpeakOptions = {}
): () => void {
  stopSpeech();

  if (typeof window === 'undefined') {
    return () => {};
  }

  const { tokens, sentences } = parsed;
  const rate = options.rate ?? 1.0;
  let isCancelled = false;
  let currentSentenceTimer: ReturnType<typeof setTimeout> | null = null;
  let wordTimers: ReturnType<typeof setTimeout>[] = [];

  const clearWordTimers = () => {
    wordTimers.forEach((t) => clearTimeout(t));
    wordTimers = [];
  };

  const cancel = () => {
    isCancelled = true;
    clearWordTimers();
    if (currentSentenceTimer !== null) {
      clearTimeout(currentSentenceTimer);
      currentSentenceTimer = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    options.onWordHighlight?.(-1);
  };

  activeSpeechController = { cancel };

  // Fallback if SpeechSynthesis is not supported
  if (!('speechSynthesis' in window) || sentences.length === 0) {
    let curToken = 0;
    options.onWordHighlight?.(0);

    const stepFallback = () => {
      if (isCancelled) return;
      if (curToken < tokens.length - 1) {
        curToken++;
        options.onWordHighlight?.(curToken);
        const t = tokens[curToken];
        const hasPunc = /[.,!?;:]$/.test(t.word);
        const delay = estimateWordDuration(t.cleanWord, hasPunc, rate);
        currentSentenceTimer = setTimeout(stepFallback, delay);
      } else {
        options.onWordHighlight?.(-1);
        options.onEnd?.();
      }
    };

    const firstHasPunc = tokens.length > 0 && /[.,!?;:]$/.test(tokens[0].word);
    currentSentenceTimer = setTimeout(
      stepFallback,
      tokens.length > 0 ? estimateWordDuration(tokens[0].cleanWord, firstHasPunc, rate) : 200
    );
    return cancel;
  }

  // Find preferred voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice =
    voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Victoria') ||
          v.name.includes('Daniel') ||
          v.name.includes('en-US'))
    ) || voices.find((v) => v.lang.startsWith('en'));

  let currentSentenceIdx = 0;

  function speakNextSentence() {
    if (isCancelled) return;

    if (currentSentenceIdx >= sentences.length) {
      options.onWordHighlight?.(-1);
      options.onEnd?.();
      return;
    }

    const sInfo = sentences[currentSentenceIdx];
    const sTokens = tokens.filter((t) => t.sentenceIndex === currentSentenceIdx);
    const utterance = new SpeechSynthesisUtterance(sInfo.sentenceText);

    utterance.rate = rate;
    utterance.pitch = 1.0;
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    clearWordTimers();

    // When voice starts, immediately highlight word 0 and start word schedule
    utterance.onstart = () => {
      if (isCancelled) return;
      clearWordTimers();

      // Instantly highlight first word of the sentence
      if (sTokens.length > 0) {
        options.onWordHighlight?.(sTokens[0].index);
      }

      // Schedule subsequent word highlights matching realistic spoken duration
      let accumulatedTime = 0;
      for (let i = 1; i < sTokens.length; i++) {
        const prevToken = sTokens[i - 1];
        const prevHasPunc = /[.,!?;:]$/.test(prevToken.word);
        const duration = estimateWordDuration(prevToken.cleanWord, prevHasPunc, rate);
        accumulatedTime += duration;

        const targetTokenIndex = sTokens[i].index;
        const timer = setTimeout(() => {
          if (!isCancelled) {
            options.onWordHighlight?.(targetTokenIndex);
          }
        }, accumulatedTime);

        wordTimers.push(timer);
      }
    };

    // Real-time boundary event calibration: if browser fires onboundary, snap to it immediately
    utterance.onboundary = (event) => {
      if (isCancelled) return;
      if (event.name === 'word' || typeof event.charIndex === 'number') {
        const charIdx = event.charIndex;

        // Find which token in this sentence corresponds to charIdx
        const matchedToken = sTokens.find(
          (t) => charIdx >= t.charStartInSentence && charIdx <= t.charEndInSentence
        );

        if (matchedToken) {
          options.onWordHighlight?.(matchedToken.index);
        }
      }
    };

    utterance.onend = () => {
      if (isCancelled) return;
      clearWordTimers();

      currentSentenceIdx++;
      if (currentSentenceIdx < sentences.length) {
        // Snappy transition to next sentence
        currentSentenceTimer = setTimeout(speakNextSentence, 120);
      } else {
        options.onWordHighlight?.(-1);
        options.onEnd?.();
      }
    };

    utterance.onerror = () => {
      if (isCancelled) return;
      clearWordTimers();

      currentSentenceIdx++;
      if (currentSentenceIdx < sentences.length) {
        currentSentenceTimer = setTimeout(speakNextSentence, 100);
      } else {
        options.onWordHighlight?.(-1);
        options.onEnd?.();
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  speakNextSentence();

  return cancel;
}

/**
 * Pronounce a single vocabulary word or short phrase
 */
export function speakSingleWord(word: string, rate = 0.88) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = rate;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const englishVoice =
    voices.find((v) => v.lang.startsWith('en')) || voices.find((v) => v.lang.includes('en'));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }
  window.speechSynthesis.speak(utterance);
}
