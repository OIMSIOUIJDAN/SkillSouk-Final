export type UserRole = 'seeker' | 'merchant' | null;

export type Screen = 'welcome' | 'role-select' | 'dashboard' | 'district' | 'focus-zone';

export interface District {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  bgGradient: string;
}

export interface KnowledgeProduct {
  id: string;
  districtId: string;
  title: string;
  merchantName: string;
  merchantAvatar: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  fileType: 'PDF' | 'Video' | 'Audio' | 'Interactive';
  thumbnail?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  xpReward: number;
  progress: number;
  total: number;
  emoji: string;
  deadline: string;
  completed?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  role: 'seeker' | 'merchant';
}

export interface FocusZone {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bgGradient: string;
  ambientSound?: 'rain' | 'cafe' | 'fire' | 'night';
}

export interface UserState {
  role: UserRole;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streak: number;
  achievements: string[];
  name: string;
  avatar: string;
  totalStudyMinutes: number;
  uploadsCount: number;
  downloadsCount: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  reward: number;
  xpReward: number;
  target: number;
  progress: number;
  emoji: string;
}
