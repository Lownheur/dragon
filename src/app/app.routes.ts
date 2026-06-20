import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // redirect racine vers la hero page
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'hero',
  },
  // page d'accueil Hero (publique)
  {
    path: 'hero',
    loadComponent: () => import('./features/hero/hero.component').then((m) => m.HeroComponent),
  },
  // routes auth — auth-layout
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
    ],
  },
  // routes app — main-layout (protégées)
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'edt',
        loadComponent: () =>
          import('./features/edt/edt.component').then((m) => m.EdtComponent),
      },
      {
        path: 'objectifs',
        loadComponent: () =>
          import('./features/objectifs/objectifs.component').then((m) => m.ObjectifsComponent),
      },
      {
        path: 'journal',
        loadComponent: () =>
          import('./features/journal/journal.component').then((m) => m.JournalComponent),
      },
      {
        path: 'feuille',
        loadComponent: () =>
          import('./features/character-sheet/character-sheet.component').then((m) => m.CharacterSheetComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  // redirects
  { path: '**', redirectTo: 'hero' },
];
