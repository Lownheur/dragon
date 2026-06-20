import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant login', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire avec email et password', () => {
    expect(component.form.contains('email')).toBe(true);
    expect(component.form.contains('password')).toBe(true);
  });

  it('devrait marquer le formulaire invalide quand vide', () => {
    expect(component.form.valid).toBe(false);
  });

  it('devrait marquer le formulaire valide avec des données correctes', () => {
    component.form.setValue({ email: 'test@test.com', password: '123456' });
    expect(component.form.valid).toBe(true);
  });

  it('devrait retourner une erreur pour un email invalide', () => {
    const emailCtrl = component.form.get('email')!;
    emailCtrl.setValue('invalid');
    emailCtrl.markAsTouched();
    expect(component.getError('email')).toBe('Email invalide.');
  });

  it('devrait retourner une erreur pour un email requis', () => {
    const emailCtrl = component.form.get('email')!;
    emailCtrl.setValue('');
    emailCtrl.markAsTouched();
    expect(component.getError('email')).toBe('Email requis.');
  });

  it('devrait retourner une erreur pour un mot de passe trop court', () => {
    const pwdCtrl = component.form.get('password')!;
    pwdCtrl.setValue('123');
    pwdCtrl.markAsTouched();
    expect(component.getError('password')).toContain('Minimum');
  });

  it('ne devrait pas être en soumission par défaut', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  it('ne devrait pas avoir de message d erreur par défaut', () => {
    expect(component.errorMessage()).toBe('');
  });

  it('devrait afficher le titre Connexion', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.auth-form__title')?.textContent).toContain('Connexion');
  });

  it('devrait afficher le lien vers inscription', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.auth-form__link')?.textContent).toContain('Créer un compte');
  });

  it('devrait ne pas soumettre quand le formulaire est invalide', async () => {
    await component.onSubmit();
    expect(component.isSubmitting()).toBe(false);
  });
});
