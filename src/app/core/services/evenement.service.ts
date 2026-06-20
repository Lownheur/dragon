import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Evenement } from '../models/evenement.model';
import { toCamelCase, toSnakeCase, mapArray } from '../utils/db-mapper.util';

@Injectable({ providedIn: 'root' })
export class EvenementService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  private readonly _evenements = signal<Evenement[]>([]);
  readonly evenements = this._evenements.asReadonly();

  async loadWeek(startDate: string, endDate: string): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data, error } = await this.supabase.client
      .from('evenements')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .order('start_time');

    if (error) { console.error(error); return; }
    this._evenements.set(mapArray<Evenement>(data ?? []));
  }

  async loadAll(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data, error } = await this.supabase.client
      .from('evenements')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time');

    if (error) { console.error(error); return; }
    this._evenements.set(mapArray<Evenement>(data ?? []));
  }

  async create(input: Partial<Evenement>): Promise<Evenement | null> {
    const user = this.auth.currentUser();
    if (!user) return null;

    const { data, error } = await this.supabase.client
      .from('evenements')
      .insert({ ...(toSnakeCase(input as Record<string, unknown>) as Record<string, unknown>), user_id: user.id })
      .select()
      .single();

    if (error) { console.error(error); return null; }
    const created = toCamelCase<Evenement>(data as Record<string, unknown>);
    this._evenements.update(list => [...list, created].sort(
      (a, b) => a.startTime.localeCompare(b.startTime)
    ));
    return created;
  }

  async update(id: string, changes: Partial<Evenement>): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('evenements')
      .update(toSnakeCase(changes as Record<string, unknown>) as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single();

    if (error) { console.error(error); return; }
    const updated = toCamelCase<Evenement>(data as Record<string, unknown>);
    this._evenements.update(list =>
      list.map(e => e.id === id ? { ...e, ...updated } : e)
    );
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('evenements')
      .delete()
      .eq('id', id);

    if (error) { console.error(error); return; }
    this._evenements.update(list => list.filter(e => e.id !== id));
  }
}
