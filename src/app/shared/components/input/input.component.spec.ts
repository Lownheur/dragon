import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type text', () => {
    expect(component.type()).toBe('text');
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.input-wrapper__label');
    expect(label).toBeTruthy();
    expect(label.textContent.trim()).toBe('Email');
  });

  it('should not render label when empty', () => {
    const label = fixture.nativeElement.querySelector('.input-wrapper__label');
    expect(label).toBeFalsy();
  });

  it('should render placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Entrez votre email');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Entrez votre email');
  });

  it('should show error message when provided', () => {
    fixture.componentRef.setInput('errorMessage', 'Email invalide');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.input-wrapper__error');
    expect(error).toBeTruthy();
    expect(error.textContent.trim()).toBe('Email invalide');
  });

  it('should show hint when no error', () => {
    fixture.componentRef.setInput('hint', 'Utilisez votre email professionnel');
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.input-wrapper__hint');
    expect(hint).toBeTruthy();
    expect(hint.textContent.trim()).toBe('Utilisez votre email professionnel');
  });

  it('should prioritize error over hint', () => {
    fixture.componentRef.setInput('hint', 'Some hint');
    fixture.componentRef.setInput('errorMessage', 'Some error');
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.input-wrapper__hint');
    const error = fixture.nativeElement.querySelector('.input-wrapper__error');
    expect(hint).toBeFalsy();
    expect(error).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(component.effectiveType).toBe('password');

    component.togglePassword();
    expect(component.effectiveType).toBe('text');

    component.togglePassword();
    expect(component.effectiveType).toBe('password');
  });

  it('should show toggle button for password type', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.input-wrapper__toggle');
    expect(toggle).toBeTruthy();
  });

  it('should not show toggle button for text type', () => {
    fixture.componentRef.setInput('type', 'text');
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.input-wrapper__toggle');
    expect(toggle).toBeFalsy();
  });

  it('should update value on input', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'test@email.com';
    input.dispatchEvent(new Event('input'));

    expect(component.value()).toBe('test@email.com');
  });

  it('should set focused state on focus', () => {
    expect(component.isFocused()).toBe(false);

    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus'));

    expect(component.isFocused()).toBe(true);
  });

  it('should remove focused state on blur', () => {
    component.isFocused.set(true);

    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));

    expect(component.isFocused()).toBe(false);
  });
});
