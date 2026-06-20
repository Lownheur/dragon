import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { DashboardSidebarComponent } from './sidebar.component';

describe('DashboardSidebarComponent', () => {
  let component: DashboardSidebarComponent;
  let fixture: ComponentFixture<DashboardSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSidebarComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant sidebar', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir isOpen à false par défaut', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('devrait afficher le panel sidebar', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.sidebar')).toBeTruthy();
  });

  it('ne devrait pas afficher le backdrop quand fermée', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.sidebar-backdrop')).toBeFalsy();
  });

  it('devrait afficher le backdrop quand ouverte', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.sidebar-backdrop')).toBeTruthy();
  });

  it('devrait ajouter la classe sidebar--open quand ouverte', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.sidebar--open')).toBeTruthy();
  });

  it('devrait émettre close au click du backdrop', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const spy = vi.fn();
    component.close.subscribe(spy);

    const backdrop = fixture.nativeElement.querySelector('.sidebar-backdrop');
    backdrop.click();

    expect(spy).toHaveBeenCalled();
  });

  it('devrait émettre close au click du bouton fermer', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);

    const closeBtn = fixture.nativeElement.querySelector('.sidebar__close');
    closeBtn.click();

    expect(spy).toHaveBeenCalled();
  });

  it('devrait afficher le bouton de déconnexion', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.sidebar__logout')?.textContent).toContain('Déconnexion');
  });

  it('devrait afficher le nom de marque dans le header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.sidebar__brand')?.textContent).toBeTruthy();
  });
});
