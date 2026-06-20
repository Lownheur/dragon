import { TestBed } from '@angular/core/testing';
import { SupabaseService } from './supabase.service';
import { environment } from '../../../environments/environment';

describe('SupabaseService', () => {
  let service: SupabaseService;

  // skip les tests qui nécessitent un vrai client si l'URL est vide
  const hasValidUrl = environment.supabaseUrl.startsWith('http');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupabaseService],
    });

    service = TestBed.inject(SupabaseService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait exposer un client supabase', () => {
    if (!hasValidUrl) {
      // le service est créé mais le client peut avoir une URL invalide
      // on vérifie juste que la propriété client existe
      expect(service).toHaveProperty('client');
      return;
    }
    expect(service.client).toBeTruthy();
  });

  it('devrait exposer la propriété client', () => {
    // vérifier que le getter est défini
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(service), 'client');
    expect(descriptor?.get).toBeDefined();
  });
});
