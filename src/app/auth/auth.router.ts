import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export default [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: RegisterComponent,
  }
] as Route[];
