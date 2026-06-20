export interface Personnage {
  id: string;
  userId: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXpEarned: number;
  disciplineXp: Record<string, number>; // discipline type -> xp
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const LEVEL_XP_CURVE: Record<number, number> = {
  1: 100, 2: 250, 3: 500, 4: 900, 5: 1500,
  6: 2300, 7: 3400, 8: 4800, 9: 6600, 10: 9000,
  11: 12000, 12: 15800, 13: 20400, 14: 26000, 15: 32800,
  16: 41000, 17: 50800, 18: 62400, 19: 76000, 20: 92000,
};

export function xpForLevel(level: number): number {
  return LEVEL_XP_CURVE[level] ?? Math.floor(100 * Math.pow(1.5, level - 1));
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) total += xpForLevel(i);
  return total;
}
