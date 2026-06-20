import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { AuthResult } from '../models/auth-result.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  /** utilisateur courant — null si déconnecté */
  private readonly _currentUser = signal<User | null>(null);

  /** session courante */
  private readonly _session = signal<Session | null>(null);

  /** état de chargement initial */
  private readonly _loading = signal<boolean>(true);

  /** Promise résolue une fois l'initialisation de la session terminée */
  readonly initialized: Promise<void>;
  private resolveInitialized!: () => void;

  /** lecture seule des signaux */
  readonly currentUser = this._currentUser.asReadonly();
  readonly session = this._session.asReadonly();
  readonly loading = this._loading.asReadonly();

  /** true si l'utilisateur est connecté */
  readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.initialized = new Promise<void>((resolve) => {
      this.resolveInitialized = resolve;
    });
    this.initAuthListener();
  }

  /** initialise l'écoute des changements de session */
  private initAuthListener(): void {
    // récupère la session existante au démarrage
    this.supabaseService.client.auth.getSession().then(({ data }) => {
      this._session.set(data.session);
      this._currentUser.set(data.session?.user ?? null);
      this._loading.set(false);
      this.resolveInitialized();
    });

    // écoute les changements de session (login, logout, token refresh)
    this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
      this._session.set(session);
      this._currentUser.set(session?.user ?? null);
    });
  }

  /** inscription avec email et mot de passe */
  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabaseService.client.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: this.translateError(error) };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Une erreur inattendue est survenue.' };
    }
  }

  /** connexion avec email et mot de passe */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabaseService.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: this.translateError(error) };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Une erreur inattendue est survenue.' };
    }
  }

  /** déconnexion */
  async signOut(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.router.navigate(['/auth/login']);
  }

  /** traduit les erreurs supabase en messages français */
  private translateError(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email ou mot de passe incorrect.';
      case 'User already registered':
        return 'Un compte existe déjà avec cet email.';
      case 'Signup requires a valid password':
        return 'Le mot de passe est invalide.';
      case 'Password should be at least 6 characters.':
      case 'Password should be at least 6 characters':
        return 'Le mot de passe doit contenir au moins 6 caractères.';
      case 'Unable to validate email address: invalid format':
        return "Le format de l'email est invalide.";
      default:
        return error.message || 'Une erreur est survenue.';
    }
  }
}
