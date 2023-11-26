import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LoginRequest } from '../auth/loginRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl: string;

  private isLoginSubject = new BehaviorSubject<boolean>(true);
  isLogin$ = this.isLoginSubject.asObservable();

  constructor() {
    this.baseUrl = 'http://localhost:8080/auth';
  }

  setLoginStatus(status: boolean) {
    this.isLoginSubject.next(status);
  }

  login(formValue: LoginRequest) {
    return firstValueFrom(
      this.http.post<string>(`${this.baseUrl}/login`, formValue)
    );
  }
}
