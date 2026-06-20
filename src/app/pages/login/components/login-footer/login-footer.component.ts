import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <p class="auth-form__footer">
      Pas encore de compte ? <a routerLink="/register" class="auth-form__link">Créer un compte</a>
    </p>
  `,
  styles: [`
    .auth-form__footer {
      font-size: var(--font-size-sm, 0.875rem);
      color: #888;
      text-align: center;
      margin: 0;
    }
    .auth-form__link {
      color: #000;
      font-weight: var(--font-weight-medium, 500);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  `]
})
export class LoginFooterComponent {}
