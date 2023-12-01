import { Route } from '@angular/router';
import { TodoPageComponent } from './page/todo-page.component';
import { authGuard } from '../auth/guards/auth.guard';

export const TODO_ROUTES: Route[] = [
  { path: 'list', component: TodoPageComponent, canActivate: [authGuard] },
];
