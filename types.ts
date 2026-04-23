

export interface Lesson {
  id: string;
  title: string;
  id_formatted: string;
  description?: string;
}

export interface Module {
  title: string;
  weight: string;
  icon: any; // Lucide icon
  color: string;
  lessons: Lesson[];
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

export interface ChoiceOption {
  text: string;
  outcome: string;
  isLogical: boolean;
}

export interface CachedLesson {
  script: string;
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  pulse: { text: string, sources: any[] } | null;
  masteryChoices: ChoiceOption[];
  audio?: string; 
  imageUrl?: string;
  timestamp: number;
}

export interface ExamResult {
  score: number;
  total: number;
  timestamp: number;
  weakTopics: string[];
  cachedReport?: string;
}

export interface ForgedArtifact {
  id: string;
  title: string;
  heuristic: string;
  anchor: string;
  mnemonic: string;
  timestamp: number;
}

export interface UserVault {
  mnemonics: Record<string, string>;
  lessons: Record<string, CachedLesson>;
  globalFlashcards: Flashcard[];
  examHistory: ExamResult[];
  forgedArtifacts?: ForgedArtifact[];
  pinnedArtifacts?: string[];
}

// Added ChatMessage interface to resolve Error 1 in components/AIChat.tsx
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  isCompleted: boolean;
  progress: number;
  target: number;
  type: 'daily' | 'milestone';
}

export interface LeaderboardEntry {
  userId: string;
  name?: string;
  displayName?: string;
  avatarId?: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  badgesCount?: number;
  streak?: number;
  rank?: number;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  history: string;
  complaint: string;
  targetOrgan: string;
}

export interface ScanFinding {
  zone: string;
  description: string;
  physicsHint: string;
  findingType: 'normal' | 'pathological' | 'artifact';
}

export interface Case {
  id: string;
  profile: PatientProfile;
  findings: Record<string, ScanFinding>;
  correctDiagnosis: string;
  options: string[];
  explanation: string;
}

export interface UserStats {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActive: number;
  badges: string[];
  completedQuests: string[];
  totalLessonsCompleted: number;
  totalQuizzesPassed: number;
  skillTree: Record<string, boolean>;
  activeBoosts: Record<string, number>;
  avatarId: string;
  dailyQuestsResetAt: number;
  history: {
    date: string;
    xpEarned: number;
    lessonsCompleted: number;
  }[];
}

export interface CommunityExtraction {
  id: string;
  authorId: string;
  authorName: string;
  topic: string;
  content: string;
  upvotes: number;
  timestamp: number;
  tags: string[];
}
