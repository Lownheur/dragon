import { Component, output, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class DashboardHeaderComponent {
  private readonly themeService = inject(ThemeService);
  readonly i18n = inject(I18nService);

  /** Emits when the hamburger button is clicked */
  readonly toggleSidebar = output<void>();
  /** Emits when the chat button is clicked */
  readonly toggleChat = output<void>();

  get theme() {
    return this.themeService.theme;
  }

  get locale() {
    return this.i18n.locale;
  }

  t(key: string) {
    return this.i18n.t(key);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onToggleChat(): void {
    this.toggleChat.emit();
  }

  onToggleTheme(): void {
    this.themeService.toggle();
  }

  onToggleLocale(): void {
    this.i18n.toggle();
  }
}
