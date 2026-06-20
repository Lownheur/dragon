import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObjectifService } from '../../core/services/objectif.service';
import { I18nService } from '../../core/services/i18n.service';
import { Objectif, ObjectifStatus, ObjectifPriority } from '../../core/models/objectif.model';

@Component({
  selector: 'app-objectifs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './objectifs.component.html',
  styleUrl: './objectifs.component.scss',
})
export class ObjectifsComponent implements OnInit {
  private readonly objectifService = inject(ObjectifService);
  readonly i18n = inject(I18nService);

  readonly objectifs = this.objectifService.objectifs;
  readonly showCreate = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly priorities: { value: ObjectifPriority; labelKey: string; color: string }[] = [
    { value: 'low', labelKey: 'objectifs.priorityLow', color: '#27ae60' },
    { value: 'medium', labelKey: 'objectifs.priorityMedium', color: '#f39c12' },
    { value: 'high', labelKey: 'objectifs.priorityHigh', color: '#e67e22' },
    { value: 'critical', labelKey: 'objectifs.priorityCritical', color: '#e74c3c' },
  ];

  readonly statuses: { value: ObjectifStatus; labelKey: string }[] = [
    { value: 'pending', labelKey: 'objectifs.statusPending' },
    { value: 'in_progress', labelKey: 'objectifs.statusInProgress' },
    { value: 'done', labelKey: 'objectifs.statusDone' },
    { value: 'abandoned', labelKey: 'objectifs.statusAbandoned' },
  ];

  newObjectif = this.emptyForm();
  filterStatus: ObjectifStatus | 'all' = 'all';

  ngOnInit(): void {
    this.objectifService.load();
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  private getLocale(): string {
    return this.i18n.locale() === 'en' ? 'en-US' : 'fr-FR';
  }

  priorityLabel(key: string): string {
    return this.t(key);
  }

  statusLabel(key: string): string {
    return this.t(key);
  }

  emptyForm() {
    return {
      title: '',
      description: '',
      priority: 'medium' as ObjectifPriority,
      progress: 0,
      deadline: '',
      xpReward: 100,
      tags: '',
    };
  }

  filteredObjectifs(): Objectif[] {
    const all = this.objectifs();
    if (this.filterStatus === 'all') return all;
    return all.filter(o => o.status === this.filterStatus);
  }

  stats() {
    const all = this.objectifs();
    return {
      total: all.length,
      done: all.filter(o => o.status === 'done').length,
      inProgress: all.filter(o => o.status === 'in_progress').length,
      pending: all.filter(o => o.status === 'pending').length,
      completionRate: all.length ? Math.round((all.filter(o => o.status === 'done').length / all.length) * 100) : 0,
    };
  }

  async create(): Promise<void> {
    if (!this.newObjectif.title.trim()) return;
    await this.objectifService.create({
      title: this.newObjectif.title,
      description: this.newObjectif.description,
      priority: this.newObjectif.priority,
      progress: this.newObjectif.progress,
      deadline: this.newObjectif.deadline || null,
      xpReward: this.newObjectif.xpReward,
      tags: this.newObjectif.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    });
    this.showCreate.set(false);
    this.newObjectif = this.emptyForm();
  }

  async updateStatus(id: string, status: ObjectifStatus): Promise<void> {
    const updates: Partial<Objectif> = { status };
    if (status === 'done') {
      updates.progress = 100;
      updates.completedAt = new Date().toISOString();
    }
    await this.objectifService.update(id, updates);
  }

  async updateProgress(id: string, progress: number): Promise<void> {
    const status: ObjectifStatus = progress >= 100 ? 'done' : progress > 0 ? 'in_progress' : 'pending';
    await this.objectifService.update(id, { progress, status, completedAt: progress >= 100 ? new Date().toISOString() : null });
  }

  async delete(id: string): Promise<void> {
    await this.objectifService.delete(id);
  }

  setFilter(value: string): void {
    this.filterStatus = value as ObjectifStatus | 'all';
  }

  getPriorityColor(p: ObjectifPriority): string {
    return this.priorities.find(x => x.value === p)?.color ?? '#888';
  }

  getStatusLabel(s: ObjectifStatus): string {
    const found = this.statuses.find(x => x.value === s);
    return found ? this.t(found.labelKey) : s;
  }

  isOverdue(o: Objectif): boolean {
    if (!o.deadline || o.status === 'done') return false;
    return new Date(o.deadline) < new Date();
  }

  formatDeadline(d: string | null): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString(this.getLocale(), { day: 'numeric', month: 'short' });
  }
}
