import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth',
    pathMatch: 'full',
    loadChildren: () => import('./auth/auth.router'),
  },
  {
    path: 'todo',
    pathMatch: 'full',
    loadChildren: () => import('./todo/todo.router'),
  },
];
