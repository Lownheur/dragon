import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant main-layout', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le conteneur main-layout', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.main-layout')).toBeTruthy();
  });

  it('devrait afficher la zone de contenu principal', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.main-layout__content')).toBeTruthy();
  });

  it('devrait contenir un router-outlet', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
