import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequest } from '../loginRequest.interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);


  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    this.authService.setLoginStatus(false);
  }

  async submitForm() {
    try {
      const response: string = await this.authService.login(
        this.loginForm.value as LoginRequest
      );
      const jwtToken = response;
      this.cookieService.set('token', jwtToken, 1);

      this.router.navigate(['/todo/list']);
      this.authService.setLoginStatus(true);
    } catch (error) {
      console.error(' Error login:', error);
    }
  }


}
