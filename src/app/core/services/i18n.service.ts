import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Locale = 'fr' | 'en';

interface Translations {
  [key: string]: string | Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly http = inject(HttpClient);

  private readonly STORAGE_KEY = 'dragon-locale';

  readonly locale = signal<Locale>(this.loadLocale());

  private translations: Record<Locale, Translations> = {
    fr: {},
    en: {},
  };

  constructor() {
    // Pre-load both locales
    this.loadTranslations('fr');
    this.loadTranslations('en');
  }

  async loadTranslations(locale: Locale): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<Translations>(`/i18n/${locale}.json`)
      );
      this.translations[locale] = data;
    } catch {
      this.translations[locale] = {};
    }
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: unknown = this.translations[this.locale()];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    if (typeof value !== 'string') return key;
    if (!params) return value;
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v)),
      value
    );
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    localStorage.setItem(this.STORAGE_KEY, locale);
  }

  toggle(): void {
    this.setLocale(this.locale() === 'fr' ? 'en' : 'fr');
  }

  private loadLocale(): Locale {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Locale | null;
    if (stored === 'fr' || stored === 'en') return stored;
    return 'fr';
  }
}
