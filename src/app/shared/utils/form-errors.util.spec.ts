import { FormControl, Validators } from '@angular/forms';
import { getFormError } from './form-errors.util';

describe('getFormError', () => {
  it('devrait retourner une chaîne vide si le contrôle est null', () => {
    expect(getFormError(null, 'email')).toBe('');
  });

  it('devrait retourner une chaîne vide si le contrôle n a pas d erreurs', () => {
    const ctrl = new FormControl('valid@email.com', [Validators.required, Validators.email]);
    ctrl.markAsTouched();
    expect(getFormError(ctrl, 'email')).toBe('');
  });

  it('devrait retourner une chaîne vide si le contrôle n est pas touché', () => {
    const ctrl = new FormControl('', [Validators.required]);
    expect(getFormError(ctrl, 'email')).toBe('');
  });

  it('devrait retourner "Email requis." pour un email required', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.markAsTouched();
    expect(getFormError(ctrl, 'email')).toBe('Email requis.');
  });

  it('devrait retourner "Email invalide." pour un email invalide', () => {
    const ctrl = new FormControl('bad', [Validators.email]);
    ctrl.markAsTouched();
    expect(getFormError(ctrl, 'email')).toBe('Email invalide.');
  });

  it('devrait retourner le message minlength avec le bon nombre', () => {
    const ctrl = new FormControl('ab', [Validators.minLength(6)]);
    ctrl.markAsTouched();
    expect(getFormError(ctrl, 'password')).toBe('Minimum 6 caractères.');
  });

  it('devrait retourner le message de mismatch pour passwordMismatch', () => {
    const ctrl = new FormControl('abc');
    ctrl.setErrors({ passwordMismatch: true });
    ctrl.markAsTouched();
    expect(getFormError(ctrl, 'confirmPassword')).toBe('Les mots de passe ne correspondent pas.');
  });

  it('devrait capitaliser le nom du champ pour required générique', () => {
    const ctrl = new FormControl('', [Validators.required]);
    ctrl.markAsTouched();
    expect(getFormError(ctrl, 'password')).toBe('Password requis.');
  });
});
