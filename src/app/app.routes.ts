import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTE)
  },
  {
    path: 'todo',
    loadChildren: () => import('./todo/todo.routes').then(m => m.TODO_ROUTES)
  },
];
