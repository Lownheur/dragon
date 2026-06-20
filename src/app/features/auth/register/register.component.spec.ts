import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant register', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire avec email, password et confirmPassword', () => {
    expect(component.form.contains('email')).toBe(true);
    expect(component.form.contains('password')).toBe(true);
    expect(component.form.contains('confirmPassword')).toBe(true);
  });

  it('devrait marquer le formulaire invalide quand vide', () => {
    expect(component.form.valid).toBe(false);
  });

  it('devrait marquer le formulaire valide avec des données correctes', () => {
    component.form.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });
    expect(component.form.valid).toBe(true);
  });

  it('devrait détecter un mismatch de mot de passe', () => {
    component.form.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '654321',
    });
    const confirm = component.form.get('confirmPassword')!;
    confirm.markAsTouched();
    expect(component.getError('confirmPassword')).toBe('Les mots de passe ne correspondent pas.');
  });

  it('devrait retourner une erreur pour un email invalide', () => {
    const emailCtrl = component.form.get('email')!;
    emailCtrl.setValue('invalid');
    emailCtrl.markAsTouched();
    expect(component.getError('email')).toBe('Email invalide.');
  });

  it('devrait retourner une erreur pour un mot de passe trop court', () => {
    const pwdCtrl = component.form.get('password')!;
    pwdCtrl.setValue('12');
    pwdCtrl.markAsTouched();
    expect(component.getError('password')).toContain('Minimum');
  });

  it('ne devrait pas être en soumission par défaut', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  it('ne devrait pas avoir de message d erreur par défaut', () => {
    expect(component.errorMessage()).toBe('');
  });

  it('devrait afficher le titre Créer un compte', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.auth-form__title')?.textContent).toContain('Créer un compte');
  });

  it('devrait afficher le lien vers connexion', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.auth-form__link')?.textContent).toContain('Se connecter');
  });

  it('devrait ne pas soumettre quand le formulaire est invalide', async () => {
    await component.onSubmit();
    expect(component.isSubmitting()).toBe(false);
  });
});
