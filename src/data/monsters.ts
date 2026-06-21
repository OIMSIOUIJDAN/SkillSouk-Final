export interface Monster {
  id: string;
  name: string;
  emoji: string;
  maxHP: number;
  damagePerHit: number; // damage player deals every 60 seconds
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  coinReward: number;
  xpReward: number;
}

export const MONSTERS: Monster[] = [
  {
    id: 'slime',
    name: 'Procrastination Slime',
    emoji: '🦠',
    maxHP: 1500,
    damagePerHit: 100,
    durationMinutes: 15,
    difficulty: 'Easy',
    description: 'A wobbling blob of distraction. Perfect for beginners.',
    coinReward: 50,
    xpReward: 75,
  },
  {
    id: 'golem',
    name: 'The Theorem Titan',
    emoji: '🗿',
    maxHP: 2500,
    damagePerHit: 100,
    durationMinutes: 25,
    difficulty: 'Medium',
    description: 'Ancient theorems carved in stone block your path.',
    coinReward: 100,
    xpReward: 150,
  },
  {
    id: 'dragon',
    name: 'Thesis Dragon',
    emoji: '🐉',
    maxHP: 5000,
    damagePerHit: 100,
    durationMinutes: 50,
    difficulty: 'Hard',
    description: 'The ultimate beast. Slay it to prove your mastery.',
    coinReward: 250,
    xpReward: 400,
  },
];

export function getMonsterById(id: string): Monster | undefined {
  return MONSTERS.find(m => m.id === id);
}
