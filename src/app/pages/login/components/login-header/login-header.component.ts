import { Component } from '@angular/core';

@Component({
  selector: 'app-login-header',
  standalone: true,
  template: `
    <h2 class="auth-form__title">Connexion</h2>
    <p class="auth-form__sub">Content de vous revoir.</p>
  `,
  styles: [`
    .auth-form__title {
      font-size: var(--font-size-xl, 1.5rem);
      font-weight: var(--font-weight-bold, 700);
      color: #000;
      margin: 0;
    }
    .auth-form__sub {
      font-size: var(--font-size-sm, 0.875rem);
      color: #888;
      margin: 0;
      margin-top: -12px;
    }
  `]
})
export class LoginHeaderComponent {}
