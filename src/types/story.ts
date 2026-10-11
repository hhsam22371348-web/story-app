export interface ClueItem {
  id: string;
  title: string;
  description: string;
  xPercent: number; // position on illustration
  yPercent: number;
  hint: string;
}

export interface FeelingChoice {
  id: string;
  word: string;
  emoji: string;
  isCorrect: boolean;
  feedback: string;
}

export interface SentenceBuilderData {
  prefix: string; // e.g. "Milo feels"
  emotionOptions: string[]; // ["sad", "happy", "worried"]
  correctEmotion: string;
  middleText: string; // "because"
  reasonOptions: string[]; // ["his lunch is gone", "he found a toy", "it is sunny"]
  correctReason: string;
  explanation: string;
}

export interface FeelingCheckData {
  question: string;
  choices: FeelingChoice[];
  sentenceBuilder: SentenceBuilderData;
}

export interface EmpathyChoice {
  id: string;
  text: string;
  isBest: boolean;
  miloReactionText: string;
  miloExpressionEmoji: string;
  explanation: string;
}

export interface EmpathyScenario {
  prompt: string;
  miloSpeech: string;
  choices: EmpathyChoice[];
}

export interface StoryPage {
  pageNumber: number; // 1 to 8
  title: string;
  text: string; // The primary reading text (1-2 sentences)
  illustrationUrl: string;
  illustrationAlt: string;
  hasEmotionLens: boolean;
  emotionLensPrompt?: string;
  clues?: ClueItem[];
  feelingCheck?: FeelingCheckData;
  empathyScenario?: EmpathyScenario;
  sceneThemeColor?: string;
}

export interface EmotionWordDef {
  word: string;
  emoji: string;
  simpleMeaning: string;
  storySentence: string;
  koreanOrKidHint?: string;
}
