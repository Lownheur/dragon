import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHeaderComponent } from './header.component';

describe('DashboardHeaderComponent', () => {
  let component: DashboardHeaderComponent;
  let fixture: ComponentFixture<DashboardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant header', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher un élément header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.header')).toBeTruthy();
  });

  it('devrait afficher le bouton hamburger', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.header__hamburger')).toBeTruthy();
  });

  it('devrait afficher 3 lignes dans le hamburger', () => {
    const el = fixture.nativeElement as HTMLElement;
    const lines = el.querySelectorAll('.header__hamburger-line');
    expect(lines.length).toBe(3);
  });

  it('devrait émettre toggleSidebar au click du hamburger', () => {
    const spy = vi.fn();
    component.toggleSidebar.subscribe(spy);

    const btn = fixture.nativeElement.querySelector('.header__hamburger');
    btn.click();

    expect(spy).toHaveBeenCalled();
  });

  it('devrait avoir un aria-label sur le bouton hamburger', () => {
    const el = fixture.nativeElement as HTMLElement;
    const btn = el.querySelector('.header__hamburger');
    expect(btn?.getAttribute('aria-label')).toBeTruthy();
  });
});
