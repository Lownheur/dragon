import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScheduleBlock {
  time: string;
  label: string;
  type: 'taf' | 'sport' | 'alimentation' | 'trajet' | 'sommeil' | 'perso' | 'default';
  done?: boolean;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  readonly selectedDate = signal(new Date());

  readonly weekDays = computed(() => {
    const date = this.selectedDate();
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  });

  readonly scheduleBlocks = signal<ScheduleBlock[]>([
    { time: '07:00', label: '☀️ Réveil', type: 'default' },
    { time: '07:30', label: '🏃 Sport — Course', type: 'sport' },
    { time: '08:30', label: '🍳 Petit-déjeuner', type: 'alimentation' },
    { time: '09:00', label: '💼 Travail', type: 'taf' },
    { time: '12:00', label: '🍽️ Déjeuner', type: 'alimentation' },
    { time: '13:00', label: '💼 Travail', type: 'taf' },
    { time: '17:00', label: '🚗 Trajet retour', type: 'trajet' },
    { time: '18:00', label: '🍽️ Dîner', type: 'alimentation' },
    { time: '22:00', label: '😴 Coucher', type: 'sommeil' },
  ]);

  readonly formattedDate = computed(() => {
    return this.selectedDate().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  });

  toggleBlock(index: number): void {
    this.scheduleBlocks.update((blocks) =>
      blocks.map((b, i) => (i === index ? { ...b, done: !b.done } : b))
    );
  }

  previousWeek(): void {
    this.selectedDate.update((d) => {
      const copy = new Date(d);
      copy.setDate(d.getDate() - 7);
      return copy;
    });
  }

  nextWeek(): void {
    this.selectedDate.update((d) => {
      const copy = new Date(d);
      copy.setDate(d.getDate() + 7);
      return copy;
    });
  }
}
