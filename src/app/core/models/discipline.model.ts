export type DisciplineType = 'sport' | 'sleep' | 'food' | 'work' | 'travel' | 'study' | 'social' | 'health';

export interface Discipline {
  id: string;
  userId: string;
  name: string;
  type: DisciplineType;
  icon: string;
  color: string;
  xp: number;
  level: number;
  createdAt: string;
}

export const DEFAULT_DISCIPLINES: Omit<Discipline, 'id' | 'userId' | 'createdAt'>[] = [
  { name: 'Sport', type: 'sport', icon: '🏃', color: '#e74c3c', xp: 0, level: 1 },
  { name: 'Sommeil', type: 'sleep', icon: '😴', color: '#9b59b6', xp: 0, level: 1 },
  { name: 'Alimentation', type: 'food', icon: '🍎', color: '#27ae60', xp: 0, level: 1 },
  { name: 'Travail', type: 'work', icon: '💼', color: '#3498db', xp: 0, level: 1 },
  { name: 'Trajets', type: 'travel', icon: '🚗', color: '#f39c12', xp: 0, level: 1 },
  { name: 'Études', type: 'study', icon: '📚', color: '#e67e22', xp: 0, level: 1 },
  { name: 'Social', type: 'social', icon: '👥', color: '#1abc9c', xp: 0, level: 1 },
  { name: 'Santé', type: 'health', icon: '💊', color: '#e91e63', xp: 0, level: 1 },
];
