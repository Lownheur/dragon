import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  /** variante visuelle du bouton */
  variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>('primary');

  /** taille du bouton */
  size = input<'sm' | 'md' | 'lg'>('md');

  /** type html du bouton */
  type = input<'button' | 'submit' | 'reset'>('button');

  /** état désactivé */
  disabled = input<boolean>(false);

  /** état de chargement — affiche un spinner et désactive le bouton */
  loading = input<boolean>(false);

  /** pleine largeur */
  fullWidth = input<boolean>(false);

  /** événement de click émis quand le bouton n'est ni disabled ni loading */
  clicked = output<MouseEvent>();

  get buttonClasses(): Record<string, boolean> {
    return {
      [`btn--${this.variant()}`]: true,
      [`btn--${this.size()}`]: true,
      'btn--disabled': this.disabled() || this.loading(),
      'btn--loading': this.loading(),
      'btn--full-width': this.fullWidth(),
    };
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
