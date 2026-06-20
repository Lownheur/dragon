import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Objective {
  id: number;
  label: string;
  progress: number;
  xp: number;
  level: number;
  type: 'sport' | 'sommeil' | 'alimentation' | 'taf' | 'trajet';
}

@Component({
  selector: 'app-objectives',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.scss',
})
export class ObjectivesComponent {
  readonly objectives = signal<Objective[]>([
    { id: 1, label: 'Course 3x/semaine', progress: 66, xp: 400, level: 5, type: 'sport' },
    { id: 2, label: '8h de sommeil', progress: 87, xp: 320, level: 4, type: 'sommeil' },
    { id: 3, label: 'Manger sainement', progress: 50, xp: 250, level: 3, type: 'alimentation' },
    { id: 4, label: 'Trajets voiture', progress: 100, xp: 150, level: 2, type: 'trajet' },
    { id: 5, label: 'Taf 9h-17h', progress: 80, xp: 500, level: 6, type: 'taf' },
  ]);

  readonly newObjectiveLabel = signal('');

  addObjective(): void {
    const label = this.newObjectiveLabel().trim();
    if (!label) return;
    const newObj: Objective = {
      id: Date.now(),
      label,
      progress: 0,
      xp: 0,
      level: 1,
      type: 'taf',
    };
    this.objectives.update((objs) => [...objs, newObj]);
    this.newObjectiveLabel.set('');
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.addObjective();
  }

  xpForLevel(level: number): number {
    return level * 100;
  }
}
