import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndicateurService } from '../../core/services/indicateur.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.scss',
})
export class JournalComponent implements OnInit {
  private readonly indicateurService = inject(IndicateurService);
  readonly i18n = inject(I18nService);

  readonly today = computed(() =>
    new Date().toLocaleDateString(this.i18n.locale() === 'en' ? 'en-US' : 'fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  );

  readonly todayData = this.indicateurService.today;
  readonly saving = signal(false);
  readonly selectedDate = signal(new Date().toISOString().split('T')[0]);

  form = {
    mood: 5,
    energy: 5,
    stress: 5,
    sleepQuality: 5,
    sleepHours: 7,
    waterIntake: 2,
    exerciseMinutes: 0,
    screenTime: 0,
    notes: '',
  };

  t(key: string): string {
    return this.i18n.t(key);
  }

  async ngOnInit(): Promise<void> {
    const date = this.selectedDate();
    const data = await this.indicateurService.loadForDate(date);
    if (data) {
      this.form = {
        mood: data.mood,
        energy: data.energy,
        stress: data.stress,
        sleepQuality: data.sleepQuality,
        sleepHours: data.sleepHours,
        waterIntake: data.waterIntake,
        exerciseMinutes: data.exerciseMinutes,
        screenTime: data.screenTime,
        notes: data.notes,
      };
    }
  }

  async save(): Promise<void> {
    this.saving.set(true);
    await this.indicateurService.save({ date: this.selectedDate(), ...this.form });
    this.saving.set(false);
  }

  moodEmoji(score: number): string {
    if (score >= 8) return '😊';
    if (score >= 5) return '😐';
    if (score >= 3) return '😔';
    return '😤';
  }

  get moodLabel(): string {
    const m = this.form.mood;
    if (m >= 8) return this.t('journal.labels.excellent');
    if (m >= 6) return this.t('journal.labels.good');
    if (m >= 4) return this.t('journal.labels.average');
    return this.t('journal.labels.low');
  }

  get energyLabel(): string {
    const e = this.form.energy;
    if (e >= 8) return this.t('journal.labels.energetic');
    if (e >= 5) return this.t('journal.labels.normal');
    return this.t('journal.labels.tired');
  }

  get stressLabel(): string {
    const s = this.form.stress;
    if (s >= 8) return this.t('journal.labels.veryStressed');
    if (s >= 5) return this.t('journal.labels.moderate');
    return this.t('journal.labels.calm');
  }

  get sleepLabel(): string {
    if (this.form.sleepHours >= 8) return this.t('journal.labels.sufficient');
    if (this.form.sleepHours >= 6) return this.t('journal.labels.average2');
    return this.t('journal.labels.insufficient');
  }
}
