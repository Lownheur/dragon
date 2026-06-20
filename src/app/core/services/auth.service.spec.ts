import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

/** mock du client supabase */
const mockSupabaseClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: vi
      .fn()
      .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn().mockResolvedValue({}),
  },
};

const mockSupabaseService = {
  client: mockSupabaseClient,
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: SupabaseService, useValue: mockSupabaseService }],
    });

    service = TestBed.inject(AuthService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait ne pas être authentifié par défaut', async () => {
    await service.initialized;
    expect(service.isAuthenticated()).toBe(false);
  });

  it('devrait avoir currentUser à null par défaut', async () => {
    await service.initialized;
    expect(service.currentUser()).toBeNull();
  });

  it('devrait avoir session à null par défaut', async () => {
    await service.initialized;
    expect(service.session()).toBeNull();
  });

  it('devrait retourner success true quand signIn réussit', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({ error: null });
    const result = await service.signIn('test@test.com', '123456');
    expect(result.success).toBe(true);
  });

  it('devrait retourner une erreur traduite quand signIn échoue', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid login credentials' },
    });
    const result = await service.signIn('test@test.com', 'wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Email ou mot de passe incorrect.');
  });

  it('devrait retourner success true quand signUp réussit', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({ error: null });
    const result = await service.signUp('new@test.com', '123456');
    expect(result.success).toBe(true);
  });

  it('devrait retourner une erreur traduite quand signUp échoue', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      error: { message: 'User already registered' },
    });
    const result = await service.signUp('existing@test.com', '123456');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Un compte existe déjà avec cet email.');
  });

  it('devrait gérer une erreur inattendue lors du signIn', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockRejectedValueOnce(new Error('network'));
    const result = await service.signIn('test@test.com', '123456');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Une erreur inattendue est survenue.');
  });
});
