import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * guard fonctionnel qui protège les routes nécessitant une authentification.
 * redirige vers /login si l'utilisateur n'est pas connecté.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.initialized.then(() => {
    if (authService.isAuthenticated()) {
      return true;
    }
    return router.createUrlTree(['/auth/login']);
  });
};
