import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public buttonLogin = false;
  public showAlert = false;

  public loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() { }

  submitFormLogin() {
    this.buttonLogin = true;
    const { username, password } = this.loginForm.value;
    this.authService.login(username.toLowerCase(), password).subscribe({
      next: () => {
        this.router.navigateByUrl('/todo/list');
        this.buttonLogin = false;
      },
      error: () => {
        this.buttonLogin = false;
        this.showAlert = true;
        setTimeout( () => {
          this.showAlert = false;
        }, 3000);

      }
    }

    );
  }
}
