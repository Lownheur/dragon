import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnageService } from '../../core/services/personnage.service';
import { DisciplineService } from '../../core/services/discipline.service';
import { ProfilService } from '../../core/services/profil.service';
import { Personnage, xpForLevel } from '../../core/models/personnage.model';
import { Discipline } from '../../core/models/discipline.model';
import { Profil } from '../../core/models/profil.model';

@Component({
  selector: 'app-character-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.scss',
})
export class CharacterSheetComponent implements OnInit {
  private readonly personnageService = inject(PersonnageService);
  private readonly disciplineService = inject(DisciplineService);
  private readonly profilService = inject(ProfilService);

  readonly personnage = this.personnageService.personnage;
  readonly disciplines = this.disciplineService.disciplines;
  readonly profil = this.profilService.profil;

  readonly isEditing = signal(false);
  readonly editForm = signal<Partial<Profil>>({});

  ngOnInit(): void {
    this.personnageService.load();
    this.disciplineService.load();
    this.profilService.load();
  }

  get level(): number {
    return this.personnage()?.level ?? 1;
  }

  get xp(): number {
    return this.personnage()?.xp ?? 0;
  }

  get xpToNextLevel(): number {
    return xpForLevel(this.level);
  }

  get xpProgress(): number {
    const p = this.personnage();
    if (!p) return 0;
    return Math.round((p.xp / p.xpToNextLevel) * 100);
  }

  get totalXp(): number {
    return this.personnage()?.totalXpEarned ?? 0;
  }

  get streakDays(): number {
    return this.personnage()?.streakDays ?? 0;
  }

  get longestStreak(): number {
    return this.personnage()?.longestStreak ?? 0;
  }

  get age(): number | null {
    const p = this.profil();
    if (!p) return null;
    return ProfilService.calculerAge(p.dateAniv);
  }

  disciplineStats(): Discipline[] {
    return this.disciplines();
  }

  startEdit(): void {
    const p = this.profil();
    if (!p) return;
    this.editForm.set({ ...p });
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  async saveEdit(): Promise<void> {
    const changes = this.editForm();
    await this.profilService.update(changes);
    this.isEditing.set(false);
  }
}
