import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { RouterModule } from '@angular/router';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant hero', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le nom de marque Dragon dans le logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero__logo')?.textContent).toContain('Dragon');
  });

  it('devrait afficher le titre principal', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero__title')?.textContent).toContain('Votre emploi du temps');
  });

  it('devrait afficher le sous-titre', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero__sub')?.textContent).toContain('Planifiez votre semaine');
  });

  it('devrait afficher les liens connexion et inscription quand non authentifié', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.hero__nav-actions a');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });
});
