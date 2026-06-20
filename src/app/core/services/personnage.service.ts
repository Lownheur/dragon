import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Personnage, xpForLevel } from '../models/personnage.model';

@Injectable({ providedIn: 'root' })
export class PersonnageService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  private readonly _personnage = signal<Personnage | null>(null);
  readonly personnage = this._personnage.asReadonly();

  async load(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data, error } = await this.supabase.client
      .from('personnages')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { console.error(error); return; }

    if (!data) {
      await this.create(user.id);
      return;
    }

    this._personnage.set(data as Personnage);
  }

  async create(userId: string): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('personnages')
      .insert({ user_id: userId, name: 'Dragon', level: 1, xp: 0, xp_to_next_level: xpForLevel(1), total_xp_earned: 0, discipline_xp: {}, streak_days: 0, longest_streak: 0, last_active_date: null })
      .select()
      .single();

    if (error) { console.error(error); return; }
    this._personnage.set(data as Personnage);
  }

  async addXp(xp: number, disciplineType?: string): Promise<void> {
    const p = this._personnage();
    if (!p) return;

    let newTotalXp = p.totalXpEarned + xp;
    let newLevel = p.level;
    let newXp = p.xp + xp;
    let newXpToNext = p.xpToNextLevel;

    // Check level up
    while (newXp >= newXpToNext && newLevel < 100) {
      newXp -= newXpToNext;
      newLevel++;
      newXpToNext = xpForLevel(newLevel);
    }

    const updates: Partial<Personnage> = {
      xp: newXp,
      level: newLevel,
      xpToNextLevel: newXpToNext,
      totalXpEarned: newTotalXp,
    };

    if (disciplineType) {
      const disciplineXp = { ...p.disciplineXp, [disciplineType]: (p.disciplineXp[disciplineType] ?? 0) + xp };
      updates.disciplineXp = disciplineXp;
    }

    await this.supabase.client
      .from('personnages')
      .update(updates)
      .eq('id', p.id);

    this._personnage.update(existing => existing ? { ...existing, ...updates } : existing);
  }

  async updateStreak(): Promise<void> {
    const p = this._personnage();
    if (!p) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = p.streakDays;
    let longest = p.longestStreak;

    if (p.lastActiveDate === today) return; // already updated today

    if (p.lastActiveDate === yesterday) {
      newStreak = p.streakDays + 1;
    } else if (p.lastActiveDate !== today) {
      newStreak = 1;
    }

    if (newStreak > longest) longest = newStreak;

    await this.supabase.client
      .from('personnages')
      .update({ streak_days: newStreak, longest_streak: longest, last_active_date: today, updated_at: new Date().toISOString() })
      .eq('id', p.id);

    this._personnage.update(existing => existing ? { ...existing, streakDays: newStreak, longestStreak: longest, lastActiveDate: today } : existing);
  }
}
