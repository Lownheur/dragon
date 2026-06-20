import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { DashboardHeaderComponent } from "./components/header/header.component";
import { DashboardSidebarComponent } from "./components/sidebar/sidebar.component";
import { ChatComponent } from "../chat/chat.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardHeaderComponent, DashboardSidebarComponent, ChatComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
  readonly isSidebarOpen = signal(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}