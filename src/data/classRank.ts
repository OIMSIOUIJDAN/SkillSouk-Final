export interface ClassRankEntry {
  id: string;
  name: string;
  avatar: string;
  averageGrade: number;
}

export const CLASS_RANK: ClassRankEntry[] = [
  { id: 'cr1', name: 'Zara Al-Hassan', avatar: '🧕', averageGrade: 97 },
  { id: 'cr2', name: 'Omar ibn Sina', avatar: '🧙', averageGrade: 92 },
  { id: 'cr3', name: 'Fatima Scholar', avatar: '👩‍🎓', averageGrade: 87 },
  { id: 'cr4', name: 'Hassan Logic', avatar: '🧑‍💻', averageGrade: 78 },
  { id: 'cr5', name: 'Youssef Seeker', avatar: '🎓', averageGrade: 65 },
];

export function getTitle(grade: number): string {
  if (grade >= 90) return 'Grandmaster';
  if (grade >= 80) return 'Scholar';
  if (grade >= 60) return 'Apprentice';
  return 'Novice';
}
