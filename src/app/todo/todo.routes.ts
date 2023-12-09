import { Route } from '@angular/router';
import { TodoPageComponent } from './page/todo-page.component';

export const TODO_ROUTES: Route[] = [
  { path: 'list', component: TodoPageComponent },
];
