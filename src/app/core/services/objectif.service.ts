import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Objectif } from '../models/objectif.model';

@Injectable({ providedIn: 'root' })
export class ObjectifService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  private readonly _objectifs = signal<Objectif[]>([]);
  readonly objectifs = this._objectifs.asReadonly();

  async load(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data, error } = await this.supabase.client
      .from('objectifs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) { console.error(error); return; }
    this._objectifs.set((data as Objectif[]) ?? []);
  }

  async create(input: Partial<Objectif>): Promise<Objectif | null> {
    const user = this.auth.currentUser();
    if (!user) return null;

    const { data, error } = await this.supabase.client
      .from('objectifs')
      .insert({ ...input, user_id: user.id })
      .select()
      .single();

    if (error) { console.error(error); return null; }
    this._objectifs.update(list => [data as Objectif, ...list]);
    return data as Objectif;
  }

  async update(id: string, changes: Partial<Objectif>): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('objectifs')
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) { console.error(error); return; }
    this._objectifs.update(list =>
      list.map(o => o.id === id ? { ...o, ...(data as Objectif) } : o)
    );
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('objectifs')
      .delete()
      .eq('id', id);

    if (error) { console.error(error); return; }
    this._objectifs.update(list => list.filter(o => o.id !== id));
  }

  async complete(id: string): Promise<void> {
    await this.update(id, {
      status: 'done',
      progress: 100,
      completedAt: new Date().toISOString(),
    });
  }
}
