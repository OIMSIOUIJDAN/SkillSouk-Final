export interface QuizLeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  level: number;
  quizzesPassed: number;
  accuracy: number; // percentage 0-100
}

export const QUIZ_LEADERBOARD: QuizLeaderboardEntry[] = [
  { id: 'q1', name: 'Scribe Zara', avatar: '🧕', level: 18, quizzesPassed: 42, accuracy: 96 },
  { id: 'q2', name: 'Omar the Wise', avatar: '🧙', level: 22, quizzesPassed: 35, accuracy: 94 },
  { id: 'q3', name: 'Fatima Scholar', avatar: '👩‍🎓', level: 15, quizzesPassed: 28, accuracy: 91 },
  { id: 'q4', name: 'Ibn Battuta Jr.', avatar: '🗺️', level: 19, quizzesPassed: 24, accuracy: 88 },
  { id: 'q5', name: 'Youssef Logic', avatar: '🧑‍💻', level: 14, quizzesPassed: 31, accuracy: 85 },
];

export const CURRENT_USER_QUIZ_RANK = {
  rank: 12,
  accuracy: 80,
  quizzesPassed: 15,
};
