import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvenementService } from '../../core/services/evenement.service';
import { Evenement, EvenementType } from '../../core/models/evenement.model';

interface DaySlot {
  date: Date;
  label: string;
  shortLabel: string;
  evenements: Evenement[];
}

@Component({
  selector: 'app-edt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edt.component.html',
  styleUrl: './edt.component.scss',
})
export class EdtComponent implements OnInit {
  private readonly evenementService = inject(EvenementService);

  readonly evenements = this.evenementService.evenements;
  readonly weekSlots = signal<DaySlot[]>([]);
  readonly selectedEvent = signal<Evenement | null>(null);
  readonly showEventModal = signal(false);
  readonly showCreateModal = signal(false);

  // New event form
  newEvent = {
    title: '',
    description: '',
    type: 'other' as EvenementType,
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    allDay: false,
    color: '#3498db',
  };

  readonly hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7h-21h
  readonly weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  readonly dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  readonly types: { value: EvenementType; label: string; color: string }[] = [
    { value: 'sport', label: 'Sport', color: '#e74c3c' },
    { value: 'work', label: 'Travail', color: '#3498db' },
    { value: 'food', label: 'Alimentation', color: '#27ae60' },
    { value: 'sleep', label: 'Sommeil', color: '#9b59b6' },
    { value: 'travel', label: 'Trajets', color: '#f39c12' },
    { value: 'study', label: 'Études', color: '#e67e22' },
    { value: 'social', label: 'Social', color: '#1abc9c' },
    { value: 'health', label: 'Santé', color: '#e91e63' },
    { value: 'other', label: 'Autre', color: '#95a5a6' },
  ];

  currentWeekStart = signal<Date>(this.getMonday(new Date()));

  ngOnInit(): void {
    this.buildWeek(this.currentWeekStart());
  }

  getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  async buildWeek(monday: Date): Promise<void> {
    const start = new Date(monday);
    const end = new Date(monday);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59);

    await this.evenementService.loadWeek(
      start.toISOString(),
      end.toISOString()
    );

    const slots: DaySlot[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const evts = this.evenements().filter(e => {
        const evtDate = new Date(e.startTime).toDateString();
        return evtDate === d.toDateString();
      });
      slots.push({
        date: d,
        label: this.dayNames[i],
        shortLabel: this.weekDays[i],
        evenements: evts,
      });
    }
    this.weekSlots.set(slots);
  }

  prevWeek(): void {
    const prev = new Date(this.currentWeekStart());
    prev.setDate(prev.getDate() - 7);
    this.currentWeekStart.set(prev);
    this.buildWeek(prev);
  }

  nextWeek(): void {
    const next = new Date(this.currentWeekStart());
    next.setDate(next.getDate() + 7);
    this.currentWeekStart.set(next);
    this.buildWeek(next);
  }

  goToday(): void {
    const today = this.getMonday(new Date());
    this.currentWeekStart.set(today);
    this.buildWeek(today);
  }

  openEvent(evt: Evenement): void {
    this.selectedEvent.set(evt);
    this.showEventModal.set(true);
  }

  closeEventModal(): void {
    this.showEventModal.set(false);
    this.selectedEvent.set(null);
  }

  openCreate(day: DaySlot): void {
    const d = day.date;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    this.newEvent = {
      title: '',
      description: '',
      type: 'other',
      date: `${yyyy}-${mm}-${dd}`,
      startTime: '09:00',
      endTime: '10:00',
      allDay: false,
      color: '#3498db',
    };
    this.showCreateModal.set(true);
  }

  async createEvent(): Promise<void> {
    if (!this.newEvent.title.trim()) return;
    const startTime = `${this.newEvent.date}T${this.newEvent.startTime}:00`;
    const endTime = `${this.newEvent.date}T${this.newEvent.endTime}:00`;

    await this.evenementService.create({
      title: this.newEvent.title,
      description: this.newEvent.description,
      type: this.newEvent.type,
      startTime,
      endTime,
      allDay: this.newEvent.allDay,
      color: this.newEvent.color,
      location: null,
      objectifId: null,
      disciplineId: null,
      reminder: null,
    });

    this.showCreateModal.set(false);
    await this.buildWeek(this.currentWeekStart());
  }

  async deleteEvent(id: string): Promise<void> {
    await this.evenementService.delete(id);
    this.closeEventModal();
    await this.buildWeek(this.currentWeekStart());
  }

  getEventStyle(evt: Evenement): Record<string, string> {
    const start = new Date(evt.startTime);
    const end = new Date(evt.endTime);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const top = ((startMinutes - 7 * 60) / (15 * 60)) * 100;
    const height = ((endMinutes - startMinutes) / (15 * 60)) * 100;
    return {
      top: `${Math.max(0, top)}%`,
      height: `${Math.max(2, height)}%`,
      backgroundColor: evt.color,
    };
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatWeekRange(): string {
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('fr-FR', opts)} – ${end.toLocaleDateString('fr-FR', { ...opts, year: 'numeric' })}`;
  }

  onTypeChange(): void {
    const t = this.types.find(x => x.value === this.newEvent.type);
    if (t) this.newEvent.color = t.color;
  }

  getDayNumber(date: Date): number {
    return date.getDate();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
}
