import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page.component';

export const TODO_ROUTE: Routes = [
  {
    path: 'todo/list',
    component: MainPageComponent
  }
]
