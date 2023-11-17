import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule
  ]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);

  public loginForm = this.fb.group({});

  constructor() {}

  submitForm() {}
}
