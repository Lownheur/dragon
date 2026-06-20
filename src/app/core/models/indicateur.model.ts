export interface Indicateur {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mood: number;      // 1-10
  energy: number;    // 1-10
  stress: number;    // 1-10
  sleepQuality: number; // 1-10
  sleepHours: number;
  waterIntake: number; // liters
  exerciseMinutes: number;
  screenTime: number; // minutes
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const INDICATEUR_DEFAULTS: Omit<Indicateur, 'id' | 'userId' | 'date' | 'createdAt' | 'updatedAt'> = {
  mood: 5,
  energy: 5,
  stress: 5,
  sleepQuality: 5,
  sleepHours: 7,
  waterIntake: 2,
  exerciseMinutes: 0,
  screenTime: 0,
  notes: '',
};
