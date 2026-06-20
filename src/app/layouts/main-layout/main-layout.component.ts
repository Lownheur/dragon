import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardHeaderComponent } from '../../features/dashboard/components/header/header.component';
import { DashboardSidebarComponent } from '../../features/dashboard/components/sidebar/sidebar.component';
import { ChatComponent } from '../../features/chat/chat.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, DashboardHeaderComponent, DashboardSidebarComponent, ChatComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  readonly isSidebarOpen = signal(false);
  readonly isChatOpen = signal(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleChat(): void {
    this.isChatOpen.update((v) => !v);
  }

  closeChat(): void {
    this.isChatOpen.set(false);
  }
}
