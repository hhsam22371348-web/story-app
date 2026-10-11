import { StoryPage, EmotionWordDef } from '../types/story';

import coverImg from '../assets/images/milo_cover_story_1791693357879.jpg';
import picnicHappyImg from '../assets/images/milo_picnic_happy_1791693369601.jpg';
import worriedBenchImg from '../assets/images/milo_missing_smile_1791693389912.jpg';
import friendsSharingImg from '../assets/images/milo_friends_sharing_1791693399257.jpg';

export const STORY_TITLE = "Milo's Missing Smile";
export const STORY_SUBTITLE = "A Feelings Detective Mystery";

export const COVER_IMAGE = coverImg;
export const PICNIC_HAPPY_IMAGE = picnicHappyImg;
export const WORRIED_BENCH_IMAGE = worriedBenchImg;
export const FRIENDS_SHARING_IMAGE = friendsSharingImg;

export const EMOTION_VOCABULARY: EmotionWordDef[] = [
  {
    word: 'Happy',
    emoji: '😊',
    simpleMeaning: 'Feeling good, smiling, and joyful.',
    storySentence: 'Milo is happy on the sunny picnic blanket.',
  },
  {
    word: 'Worried',
    emoji: '😟',
    simpleMeaning: 'Thinking something bad or troubling happened.',
    storySentence: 'Milo looks worried when he cannot find his lunch.',
  },
  {
    word: 'Sad',
    emoji: '😢',
    simpleMeaning: 'Feeling down, unhappy, or crying.',
    storySentence: 'Milo feels sad and his long rabbit ears droop.',
  },
  {
    word: 'Lonely',
    emoji: '🥺',
    simpleMeaning: 'Feeling by yourself and wishing for a friend.',
    storySentence: 'Milo sits alone on the bench and feels lonely.',
  },
  {
    word: 'Loved',
    emoji: '🥰',
    simpleMeaning: 'Feeling cared for when kind friends help you.',
    storySentence: 'Milo feels loved when friends share their treats.',
  },
];

export const STORY_PAGES: StoryPage[] = [
  // Page 1
  {
    pageNumber: 1,
    title: 'The Sunny Picnic',
    text: 'Today is the school picnic in the sunny park. Milo the rabbit is happy and excited!',
    illustrationUrl: PICNIC_HAPPY_IMAGE,
    illustrationAlt: 'Milo the rabbit smiling happily with juice on a picnic blanket in the sunny park',
    hasEmotionLens: false,
  },

  // Page 2 - Emotion Lens 1
  {
    pageNumber: 2,
    title: 'The Smile Vanishes',
    text: 'The animal friends sit down to eat. But look at Milo! His bright smile is gone.',
    illustrationUrl: WORRIED_BENCH_IMAGE,
    illustrationAlt: 'Milo looking concerned by a picnic bench',
    hasEmotionLens: true,
    emotionLensPrompt: 'Find 2 clues on Milo showing that his bright smile is gone!',
    clues: [
      {
        id: 'clue-ears-1',
        title: "Milo's Droopy Ears",
        description: 'Milo’s fluffy ears are pointing down, not up! Rabbits lower their ears when they are sad or worried.',
        xPercent: 69,
        yPercent: 44,
        hint: 'Check Milo’s long bunny ear on the right.',
      },
      {
        id: 'clue-mouth-1',
        title: 'Missing Smile',
        description: 'Milo’s mouth is not smiling anymore. It is turned down in a sad little frown.',
        xPercent: 57,
        yPercent: 44,
        hint: 'Look closely at Milo’s mouth.',
      },
    ],
  },

  // Page 3 - Feeling Check 1
  {
    pageNumber: 3,
    title: 'The Empty Lunchbox',
    text: 'Milo opens his blue lunchbox. Oh no! It is completely empty! His special strawberry muffin is missing.',
    illustrationUrl: WORRIED_BENCH_IMAGE,
    illustrationAlt: 'Milo looking into his open empty blue lunchbox on the bench',
    hasEmotionLens: false,
    feelingCheck: {
      question: 'How does Milo feel when his lunchbox is empty?',
      choices: [
        {
          id: 'c1-worried',
          word: 'Worried & Sad',
          emoji: '😟',
          isCorrect: true,
          feedback: 'Super detective work! Milo is worried and sad because his lunch is gone.',
        },
        {
          id: 'c1-excited',
          word: 'Excited',
          emoji: '🎉',
          isCorrect: false,
          feedback: 'Not quite. When your food is lost, you do not feel excited. Try again!',
        },
        {
          id: 'c1-angry',
          word: 'Silly',
          emoji: '😜',
          isCorrect: false,
          feedback: 'Milo is not joking or feeling silly right now. How would you feel?',
        },
      ],
      sentenceBuilder: {
        prefix: 'Milo feels',
        emotionOptions: ['sad', 'happy', 'sleepy'],
        correctEmotion: 'sad',
        middleText: 'because',
        reasonOptions: ['his lunch is missing', 'it is bedtime', 'he won a race'],
        correctReason: 'his lunch is missing',
        explanation: 'Milo feels sad because his lunch is missing.',
      },
    },
  },

  // Page 4 - Emotion Lens 2 + Feeling Check 2
  {
    pageNumber: 4,
    title: 'Sitting Alone',
    text: 'Milo walks away and sits on a quiet bench. A small tear rolls down his cheek.',
    illustrationUrl: WORRIED_BENCH_IMAGE,
    illustrationAlt: 'Milo sitting by himself on a wooden park bench with tears',
    hasEmotionLens: true,
    emotionLensPrompt: 'Tap 2 clues that show Milo is feeling lonely and sad!',
    clues: [
      {
        id: 'clue-tear',
        title: 'Tears on His Cheek',
        description: 'Look under Milo’s right eye—a shiny blue teardrop is rolling down his cheek!',
        xPercent: 61.5,
        yPercent: 39.5,
        hint: 'Look closely under Milo’s right eye.',
      },
      {
        id: 'clue-alone',
        title: 'Empty Bench Beside Him',
        description: 'Milo is sitting all by himself on the long wooden bench while other friends are far away.',
        xPercent: 26,
        yPercent: 48,
        hint: 'Look at the empty wooden bench to the left.',
      },
    ],
    feelingCheck: {
      question: 'How does Milo feel sitting alone on the bench?',
      choices: [
        {
          id: 'c2-lonely',
          word: 'Lonely',
          emoji: '🥺',
          isCorrect: true,
          feedback: 'Correct! Milo is away from his friends, so he feels lonely.',
        },
        {
          id: 'c2-happy',
          word: 'Happy',
          emoji: '😊',
          isCorrect: false,
          feedback: 'Milo is crying, so he is not happy right now.',
        },
        {
          id: 'c2-proud',
          word: 'Proud',
          emoji: '😎',
          isCorrect: false,
          feedback: 'Proud is when you accomplish something big. Milo needs a friend.',
        },
      ],
      sentenceBuilder: {
        prefix: 'Milo feels',
        emotionOptions: ['lonely', 'angry', 'glad'],
        correctEmotion: 'lonely',
        middleText: 'because',
        reasonOptions: ['he is sitting alone', 'he is dancing', 'he has too many toys'],
        correctReason: 'he is sitting alone',
        explanation: 'Milo feels lonely because he is sitting alone.',
      },
    },
  },

  // Page 5 - What Would You Say? 1
  {
    pageNumber: 5,
    title: 'A Friend Arrives',
    text: 'Bella the Bear notices Milo. She walks over to the bench. What would you say to Milo?',
    illustrationUrl: WORRIED_BENCH_IMAGE,
    illustrationAlt: 'Bella approaching Milo on the bench',
    hasEmotionLens: false,
    empathyScenario: {
      prompt: 'Choose the most kind and caring thing to say to Milo:',
      miloSpeech: 'Sniff... I am having a really bad picnic day...',
      choices: [
        {
          id: 'emp-1-kind',
          text: '“Are you okay, Milo? What happened?”',
          isBest: true,
          miloReactionText: '“Sniff... thank you for asking, Bella. I lost my lunchbox food.”',
          miloExpressionEmoji: '🥺❤️',
          explanation: 'Asking “Are you okay?” shows you care about your friend’s feelings!',
        },
        {
          id: 'emp-1-rude',
          text: '“Stop crying, we want to play tag!”',
          isBest: false,
          miloReactionText: '“Oh... sorry. I will hide away then...”',
          miloExpressionEmoji: '😢💔',
          explanation: 'Telling someone to stop crying can hurt their feelings even more.',
        },
        {
          id: 'emp-1-brag',
          text: '“Haha, look at my giant honey jar!”',
          isBest: false,
          miloReactionText: '“...I am hungry...”',
          miloExpressionEmoji: '😔',
          explanation: 'Bragging about your own food when a friend is hungry is not empathetic.',
        },
      ],
    },
  },

  // Page 6 - Emotion Lens 3 + Sentence Builder
  {
    pageNumber: 6,
    title: 'The Secret is Out',
    text: 'Milo whispers softly, "I dropped my lunch bag in the morning grass. I have nothing to eat."',
    illustrationUrl: WORRIED_BENCH_IMAGE,
    illustrationAlt: 'Milo holding his paws and explaining softly',
    hasEmotionLens: true,
    emotionLensPrompt: 'Tap 2 clues explaining why Milo is feeling hungry and upset!',
    clues: [
      {
        id: 'clue-lunchbox',
        title: 'Empty Blue Lunchbox',
        description: 'Milo’s blue lunchbox on the bench is wide open with only crumbs inside—no sandwich!',
        xPercent: 42,
        yPercent: 65,
        hint: 'Look inside the open blue lunchbox on the bench.',
      },
      {
        id: 'clue-paws',
        title: 'Clutched Paws',
        description: 'Milo is clutching his little front paws together on his scarf because he is nervous and hungry.',
        xPercent: 55,
        yPercent: 57,
        hint: 'Look at Milo’s front paws on his lap.',
      },
    ],
    feelingCheck: {
      question: 'Why does Milo feel hungry and upset?',
      choices: [
        {
          id: 'c3-lost-lunch',
          word: 'His lunch was lost',
          emoji: '🥪',
          isCorrect: true,
          feedback: 'Spot on, Detective! Milo dropped his food, so he has nothing to eat.',
        },
        {
          id: 'c3-too-full',
          word: 'He ate too much',
          emoji: '🧁',
          isCorrect: false,
          feedback: 'No, Milo hasn’t eaten anything yet!',
        },
        {
          id: 'c3-rain',
          word: 'It started to rain',
          emoji: '🌧️',
          isCorrect: false,
          feedback: 'The weather is sunny in the park.',
        },
      ],
      sentenceBuilder: {
        prefix: 'Milo feels',
        emotionOptions: ['hungry and sad', 'full and happy', 'scared'],
        correctEmotion: 'hungry and sad',
        middleText: 'because',
        reasonOptions: ['he has no food', 'he saw a monster', 'he forgot his hat'],
        correctReason: 'he has no food',
        explanation: 'Milo feels hungry and sad because he has no food.',
      },
    },
  },

  // Page 7 - What Would You Say? 2
  {
    pageNumber: 7,
    title: 'Helping a Friend',
    text: 'Pip the Squirrel hops over with crunchy nuts. Bella has fresh fruit sandwiches. What should they say?',
    illustrationUrl: FRIENDS_SHARING_IMAGE,
    illustrationAlt: 'Bella bear and Pip squirrel with picnic food looking at Milo',
    hasEmotionLens: false,
    empathyScenario: {
      prompt: 'What is the kindest way to help Milo right now?',
      miloSpeech: 'My tummy is grumbling, but I don’t want to ruin your picnic...',
      choices: [
        {
          id: 'emp-2-kind',
          text: '“Don’t worry! We can share our food with you!”',
          isBest: true,
          miloReactionText: '“Really?! You would share with me? You are the best friends ever!”',
          miloExpressionEmoji: '🥰✨',
          explanation: 'Sharing food and saying “I can help you” makes friends feel safe and loved.',
        },
        {
          id: 'emp-2-unkind',
          text: '“You should walk home right now.”',
          isBest: false,
          miloReactionText: '“Oh... okay. Goodbye everyone...”',
          miloExpressionEmoji: '😿',
          explanation: 'Sending a friend away leaves them feeling left out and sad.',
        },
        {
          id: 'emp-2-tease',
          text: '“Next time hold your bag tighter, silly rabbit!”',
          isBest: false,
          miloReactionText: '“I feel embarrassed now...”',
          miloExpressionEmoji: '😳💧',
          explanation: 'Teasing someone when they make an accident makes them feel embarrassed.',
        },
      ],
    },
  },

  // Page 8 - The Happy Ending
  {
    pageNumber: 8,
    title: 'Milo’s Biggest Smile',
    text: 'Bella, Pip, and Milo sit together on the picnic blanket. Milo takes a bite and smiles his biggest smile ever!',
    illustrationUrl: FRIENDS_SHARING_IMAGE,
    illustrationAlt: 'Milo smiling brightly with his friends enjoying delicious picnic treats together',
    hasEmotionLens: false,
    feelingCheck: {
      question: 'How does Milo feel now at the end of the story?',
      choices: [
        {
          id: 'c4-loved',
          word: 'Happy & Loved',
          emoji: '🥰',
          isCorrect: true,
          feedback: 'Wonderful! Milo feels happy and loved because caring friends helped him.',
        },
        {
          id: 'c4-worried',
          word: 'Worried',
          emoji: '😟',
          isCorrect: false,
          feedback: 'Milo is smiling with all his friends now! Look at his happy face.',
        },
        {
          id: 'c4-hungry',
          word: 'Lonely',
          emoji: '🥺',
          isCorrect: false,
          feedback: 'He is surrounded by warm, caring friends sharing treats.',
        },
      ],
      sentenceBuilder: {
        prefix: 'Milo feels',
        emotionOptions: ['loved and happy', 'sad and tired', 'angry'],
        correctEmotion: 'loved and happy',
        middleText: 'because',
        reasonOptions: ['his friends shared with him', 'he stayed alone', 'he lost his lunchbox'],
        correctReason: 'his friends shared with him',
        explanation: 'Milo feels loved and happy because his friends shared with him.',
      },
    },
  },
];

export const MODEL_PRACTICE_PHRASES = [
  {
    id: 'phrase-1',
    sentence: '“Are you okay, Milo?”',
    meaning: 'Asking how a friend is doing with warmth.',
    targetEmotion: 'Caring / Concern',
  },
  {
    id: 'phrase-2',
    sentence: '“I can share my lunch with you.”',
    meaning: 'Offering real help to a friend in need.',
    targetEmotion: 'Generosity / Empathy',
  },
  {
    id: 'phrase-3',
    sentence: '“You are not alone. I am your friend.”',
    meaning: 'Helping someone who feels lonely or sad.',
    targetEmotion: 'Comfort / Friendship',
  },
];
