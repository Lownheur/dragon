export type EvenementType = 'sport' | 'sleep' | 'food' | 'work' | 'travel' | 'study' | 'social' | 'health' | 'other';

export interface Evenement {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: EvenementType;
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime
  allDay: boolean;
  disciplineId: string | null;
  objectifId: string | null;
  location: string | null;
  reminder: number | null; // minutes before
  color: string;
  createdAt: string;
}
