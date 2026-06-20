import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Discipline, DEFAULT_DISCIPLINES } from '../models/discipline.model';

@Injectable({ providedIn: 'root' })
export class DisciplineService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  private readonly _disciplines = signal<Discipline[]>([]);
  readonly disciplines = this._disciplines.asReadonly();

  async load(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data, error } = await this.supabase.client
      .from('disciplines')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at');

    if (error) { console.error(error); return; }

    if (!data?.length) {
      // Initialize default disciplines
      await this.initializeDefaults();
      return;
    }

    this._disciplines.set(data as Discipline[]);
  }

  async initializeDefaults(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const rows = DEFAULT_DISCIPLINES.map(d => ({
      user_id: user.id,
      name: d.name,
      type: d.type,
      icon: d.icon,
      color: d.color,
      xp: 0,
      level: 1,
    }));

    const { data, error } = await this.supabase.client
      .from('disciplines')
      .insert(rows)
      .select();

    if (error) { console.error(error); return; }
    this._disciplines.set(data as Discipline[]);
  }

  async addXp(disciplineId: string, xp: number): Promise<void> {
    const disc = this._disciplines().find(d => d.id === disciplineId);
    if (!disc) return;

    const newXp = disc.xp + xp;
    const xpNeeded = Math.floor(100 * Math.pow(1.5, disc.level - 1));
    let newLevel = disc.level;
    let remainingXp = newXp;

    while (remainingXp >= xpNeeded && newLevel < 100) {
      remainingXp -= xpNeeded;
      newLevel++;
    }

    const { error } = await this.supabase.client
      .from('disciplines')
      .update({ xp: remainingXp, level: newLevel })
      .eq('id', disciplineId);

    if (error) { console.error(error); return; }
    this._disciplines.update(list =>
      list.map(d => d.id === disciplineId ? { ...d, xp: remainingXp, level: newLevel } : d)
    );
  }
}
