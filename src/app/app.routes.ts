import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Page d'accueil Hero (publique)
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'hero',
  },
  {
    path: 'hero',
    loadComponent: () => import('./features/hero/hero.component').then((m) => m.HeroComponent),
  },
  // Routes auth — auth-layout
  {
    path: 'auth',
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
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  // Routes app — main-layout (protégées)
  {
    path: 'app',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
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
    ],
  },
  // Catch-all → hero
  {
    path: '**',
    redirectTo: 'hero',
  },
];
