import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  /** type de l'input */
  type = input<'text' | 'email' | 'password' | 'number'>('text');

  /** label affiché au-dessus de l'input */
  label = input<string>('');

  /** placeholder de l'input */
  placeholder = input<string>('');

  /** texte d'aide affiché sous l'input */
  hint = input<string>('');

  /** message d'erreur — affiche l'état erreur si renseigné */
  errorMessage = input<string>('');

  /** identifiant unique de l'input */
  inputId = input<string>('');

  /** valeur interne */
  value = signal<string>('');

  /** état disabled */
  isDisabled = signal<boolean>(false);

  /** état focus */
  isFocused = signal<boolean>(false);

  /** visibilité du password */
  showPassword = signal<boolean>(false);

  /** type effectif — gère le toggle password */
  get effectiveType(): string {
    if (this.type() === 'password' && this.showPassword()) {
      return 'text';
    }
    return this.type();
  }

  // ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
