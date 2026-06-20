import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayoutComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant auth-layout', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le conteneur auth-layout', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.auth-layout')).toBeTruthy();
  });

  it('devrait afficher le logo Dragon', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.auth-layout__logo')?.textContent).toContain('Dragon');
  });

  it('devrait afficher la card du formulaire', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.auth-layout__card')).toBeTruthy();
  });

  it('devrait contenir un router-outlet', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
