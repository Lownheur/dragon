import { AbstractControl } from '@angular/forms';

/** messages d'erreur par type de validateur */
const ERROR_MESSAGES: Record<string, (field: string, error: unknown) => string> = {
  required: (field) =>
    field === 'email'
      ? 'Email requis.'
      : field === 'confirmPassword'
        ? 'Ce champ est requis.'
        : `${capitalize(field)} requis.`,
  email: () => 'Email invalide.',
  minlength: (_field, error) =>
    `Minimum ${(error as { requiredLength: number }).requiredLength} caractères.`,
  passwordMismatch: () => 'Les mots de passe ne correspondent pas.',
};

/**
 * retourne le premier message d'erreur pour un champ de formulaire.
 * utiliser dans les composants à la place d'un switch/if-else chain.
 */
export function getFormError(control: AbstractControl | null, field: string): string {
  if (!control || !control.touched || !control.errors) return '';

  for (const key of Object.keys(control.errors)) {
    const messageFn = ERROR_MESSAGES[key];
    if (messageFn) {
      return messageFn(field, control.errors[key]);
    }
  }

  return '';
}

/** met en majuscule la première lettre */
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
