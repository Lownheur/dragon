import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Profil, PROFIL_DEFAULTS } from '../models/profil.model';

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  private readonly _profil = signal<Profil | null>(null);
  readonly profil = this._profil.asReadonly();

  async load(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data, error } = await this.supabase.client
      .from('profils')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(error);
      return;
    }

    if (!data) {
      await this.create(user.id);
      return;
    }

    this._profil.set(data as Profil);
  }

  async create(userId: string): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('profils')
      .insert({ user_id: userId, ...PROFIL_DEFAULTS, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
    this._profil.set(data as Profil);
  }

  async update(changes: Partial<Profil>): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data, error } = await this.supabase.client
      .from('profils')
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
    this._profil.set(data as Profil);
  }

  /** Calcule l'âge depuis la date d'anniversaire */
  static calculerAge(dateAniv: string | null): number | null {
    if (!dateAniv) return null;
    const birth = new Date(dateAniv);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
}
