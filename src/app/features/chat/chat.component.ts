import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrokService, GrokMessage } from '../../core/services/grok.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private readonly grokService = inject(GrokService);
  readonly i18n = inject(I18nService);

  readonly messages = signal<Array<{ role: string; content: string }>>([]);
  readonly userInput = signal('');
  readonly isLoading = signal(false);

  canSend = computed(() => this.userInput().trim().length > 0 && !this.isLoading());

  t(key: string) {
    return this.i18n.t(key);
  }

  send(): void {
    const input = this.userInput().trim();
    if (!input || this.isLoading()) return;

    const userMsg: GrokMessage = { role: 'user', content: input };
    this.messages.update((msgs) => [...msgs, { role: 'user', content: input }]);
    this.userInput.set('');
    this.isLoading.set(true);

    this.grokService
      .sendMessage([
        ...this.messages()
          .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        userMsg,
      ])
      .subscribe({
        next: (reply) => {
          this.messages.update((msgs) => [...msgs, { role: 'assistant', content: reply }]);
          this.isLoading.set(false);
        },
        error: () => {
          this.messages.update((msgs) => [
            ...msgs,
            { role: 'assistant', content: this.t('chat.error') },
          ]);
          this.isLoading.set(false);
        },
      });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  clearChat(): void {
    this.messages.set([]);
  }
}
