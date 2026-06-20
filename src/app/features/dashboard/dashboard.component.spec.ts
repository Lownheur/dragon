import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant dashboard', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir la sidebar fermée par défaut', () => {
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('devrait ouvrir la sidebar avec toggleSidebar', () => {
    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(true);
  });

  it('devrait fermer la sidebar avec toggleSidebar si déjà ouverte', () => {
    component.toggleSidebar();
    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('devrait fermer la sidebar avec closeSidebar', () => {
    component.toggleSidebar();
    component.closeSidebar();
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('devrait afficher le composant header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-dashboard-header')).toBeTruthy();
  });

  it('devrait afficher le composant sidebar', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-dashboard-sidebar')).toBeTruthy();
  });

  it('devrait afficher la zone de contenu principal', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.dashboard-content')).toBeTruthy();
  });
});
