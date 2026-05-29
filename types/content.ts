export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type WordCategory =
  | "verbs"
  | "nouns"
  | "adjectives"
  | "prepositions"
  | "grammar"
  | "phrases";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type ConfusingWordEntry = {
  slug: string;
  title: string;
  words: string[];
  level: EnglishLevel;
  category: WordCategory;
  tags: string[];
  shortSummary: string;
  quickAnswer: string;
  coreDifference: string;
  englishExplanation: string;
  wordDetails: {
    word: string;
    partOfSpeech?: string;
    simpleMeaning: string;
    commonPatterns?: string[];
  }[];
  examples: {
    word: string;
    sentence: string;
    note?: string;
  }[];
  quiz: QuizQuestion[];
  relatedSlugs: string[];
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    keywords?: string[];
  };
};

export type SavedWordPair = {
  slug: string;
  title: string;
  savedAt: string;
};

export type WrongAnswerRecord = {
  questionId: string;
  slug: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  savedAt: string;
};
