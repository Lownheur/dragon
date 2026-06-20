import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnageService } from '../../core/services/personnage.service';
import { DisciplineService } from '../../core/services/discipline.service';
import { Discipline } from '../../core/models/discipline.model';
import { xpForLevel } from '../../core/models/personnage.model';

@Component({
  selector: 'app-personnage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnage.component.html',
  styleUrl: './personnage.component.scss',
})
export class PersonnageComponent implements OnInit {
  private readonly personnageService = inject(PersonnageService);
  private readonly disciplineService = inject(DisciplineService);

  readonly personnage = this.personnageService.personnage;
  readonly disciplines = this.disciplineService.disciplines;

  editingName = signal(false);
  nameInput = signal('');

  xpProgress = computed(() => {
    const p = this.personnage();
    if (!p) return 0;
    return Math.min(100, Math.round((p.xp / p.xpToNextLevel) * 100));
  });

  totalXpNeeded = computed(() => {
    const p = this.personnage();
    return p ? p.xpToNextLevel : 0;
  });

  levelTitle = computed(() => {
    const lvl = this.personnage()?.level ?? 1;
    if (lvl < 5) return '🐣 Nourrisson Dragon';
    if (lvl < 10) return '🐉 Dragonnet';
    if (lvl < 20) return '🔥 Dragon Affamé';
    if (lvl < 35) return '⚔️ Dragon Guerrier';
    if (lvl < 50) return '👑 Dragon Noble';
    return '🌟 Dragon Légendaire';
  });

  disciplineStats = computed(() =>
    this.disciplines().sort((a, b) => b.xp - a.xp)
  );

  barColor = computed(() => {
    const lvl = this.personnage()?.level ?? 1;
    if (lvl < 5) return '#3498db';
    if (lvl < 15) return '#27ae60';
    if (lvl < 30) return '#9b59b6';
    return '#f39c12';
  });

  ngOnInit(): void {
    this.personnageService.load();
    this.disciplineService.load();
  }

  getClassIcon(type: string): string {
    const icons: Record<string, string> = {
      sport: '🏃', sleep: '😴', food: '🍎', work: '💼',
      travel: '🚗', study: '📚', social: '👥', health: '💊'
    };
    return icons[type] ?? '✨';
  }

  startEditName(): void {
    this.nameInput.set(this.personnage()?.name ?? '');
    this.editingName.set(true);
  }

  async saveName(): Promise<void> {
    const p = this.personnage();
    if (!p || !this.nameInput().trim()) { this.editingName.set(false); return; }
    await this.personnageService['supabase'].client
      .from('personnages')
      .update({ name: this.nameInput(), updated_at: new Date().toISOString() })
      .eq('id', p.id);
    this.editingName.set(false);
  }

  getDisciplineLevelProgress(disc: Discipline): number {
    const needed = Math.floor(100 * Math.pow(1.5, disc.level - 1));
    return Math.min(100, Math.round((disc.xp / needed) * 100));
  }
}
