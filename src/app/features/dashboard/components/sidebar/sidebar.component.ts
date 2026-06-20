import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class DashboardSidebarComponent {
  private readonly authService = inject(AuthService);
  readonly i18n = inject(I18nService);

  /** Whether the sidebar is open */
  readonly isOpen = input<boolean>(false);

  /** Emits when the sidebar should close */
  readonly close = output<void>();

  get userEmail(): string | null {
    return this.authService.currentUser()?.email ?? null;
  }

  t(key: string) {
    return this.i18n.t(key);
  }

  onBackdropClick(): void {
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  async onLogout(): Promise<void> {
    this.close.emit();
    await this.authService.signOut();
  }
}
