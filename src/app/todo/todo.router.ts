import { Route } from "@angular/router";
import { TodoPageComponent } from "./pages/todo-page.component";

export const TODO_ROUTES: Route[] = [
  {path: 'list', component: TodoPageComponent}
];
