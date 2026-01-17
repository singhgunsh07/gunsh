
export enum LearnerProfile {
  ADHD = 'ADHD',
  NON_NATIVE = 'Non-Native English',
  ADVANCED = 'Advanced'
}

export enum LearningType {
  CONTENT = 'Standard Content',
  FLASHCARDS = 'Flashcards',
  GAME = 'Interactive Scenario',
  QUIZ = 'Knowledge Quiz'
}

export enum AdaptionFormat {
  HIGH_VISUAL = 'High Visual',
  SIMPLIFIED = 'Simplified Language',
  DEEP_DIVE = 'Deep Dive Edition'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface AdaptedResponse {
  adaptedText: string;
  answerToDoubt?: string;
  quiz?: QuizQuestion[];
  flashcards?: Flashcard[];
  gameScenario?: string;
  formatType: AdaptionFormat;
}
