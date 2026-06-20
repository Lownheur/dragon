import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Indicateur, INDICATEUR_DEFAULTS } from '../models/indicateur.model';

@Injectable({ providedIn: 'root' })
export class IndicateurService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  private readonly _today = signal<Indicateur | null>(null);
  readonly today = this._today.asReadonly();

  async loadForDate(date: string): Promise<Indicateur | null> {
    const user = this.auth.currentUser();
    if (!user) return null;

    const { data, error } = await this.supabase.client
      .from('indicateurs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') { console.error(error); return null; }

    const indicateur = data as Indicateur | null;
    this._today.set(indicateur);
    return indicateur;
  }

  async save(input: Partial<Indicateur> & { date: string }): Promise<Indicateur | null> {
    const user = this.auth.currentUser();
    if (!user) return null;

    const existing = await this.supabase.client
      .from('indicateurs')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', input.date)
      .single();

    const payload = {
      user_id: user.id,
      mood: input.mood ?? 5,
      energy: input.energy ?? 5,
      stress: input.stress ?? 5,
      sleep_quality: input.sleepQuality ?? 5,
      sleep_hours: input.sleepHours ?? 7,
      water_intake: input.waterIntake ?? 2,
      exercise_minutes: input.exerciseMinutes ?? 0,
      screen_time: input.screenTime ?? 0,
      notes: input.notes ?? '',
      updated_at: new Date().toISOString(),
    };

    let data: Indicateur | null = null;

    if (existing.data) {
      // Update
      const { data: updated, error } = await this.supabase.client
        .from('indicateurs')
        .update(payload)
        .eq('id', (existing.data as { id: string }).id)
        .select()
        .single();
      if (error) { console.error(error); return null; }
      data = updated as Indicateur;
    } else {
      // Insert
      const { data: inserted, error } = await this.supabase.client
        .from('indicateurs')
        .insert({ ...payload, created_at: new Date().toISOString() })
        .select()
        .single();
      if (error) { console.error(error); return null; }
      data = inserted as Indicateur;
    }

    this._today.set(data);
    return data;
  }
}
