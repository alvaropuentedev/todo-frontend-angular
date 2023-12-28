import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRegisterRequest } from '../../interfaces/login-request.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  submitFormRegister() {
    const password = this.registerForm.get('password');
    const passwordConfirm = this.registerForm.get('confirmPassword');
    if (
      password!.value !== '' &&
      passwordConfirm!.value !== '' &&
      password!.value !== null &&
      passwordConfirm!.value !== null &&
      password!.value === passwordConfirm!.value
    ) {
      this.authService.register(this.registerForm.value as LoginRegisterRequest).subscribe(() => {
        console.log('User ADDED!!');
        this.router.navigate(['/auth/login']);
      });
    } else {
      console.error('Password Dont Match!');
      this.registerForm.reset();
    }
  }
}
