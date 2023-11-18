import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.router').then(mod => mod.AUTH_ROUTE)
  },
  {
    path: 'todo',
    loadChildren: () => import('./todo/todo.router').then(mod => mod.TODO_ROUTES)
  },
];
