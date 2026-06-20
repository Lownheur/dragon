export type ObjectifStatus = 'pending' | 'in_progress' | 'done' | 'abandoned';
export type ObjectifPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Objectif {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ObjectifStatus;
  priority: ObjectifPriority;
  progress: number; // 0-100
  deadline: string | null;
  xpReward: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
