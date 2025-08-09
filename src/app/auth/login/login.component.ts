import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  public buttonLogin = false;
  public mobileView = window.innerWidth <= 768; // check mobil screen

  public loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {}

  submitFormLogin() {
    this.buttonLogin = true;
    const { username, password } = this.loginForm.value;
    this.authService.login(username.toLowerCase().trim(), password).subscribe({
      next: () => {
        this.router.navigateByUrl('/todo/list');
        this.buttonLogin = false;
      },
      error: () => {
        this.buttonLogin = false;
        this.showSuccessMessage(this.mobileView);
      },
    });
  }

  showSuccessMessage(isMobile: boolean) {
    this.messageService.add({
      key: isMobile ? 'mobileToast' : 'desktopToast',
      severity: 'error',
      icon: 'pi pi-check',
      summary: 'Not valid credentials',
    });
  }
}
