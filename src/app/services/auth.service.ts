import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LoginRequest } from '../auth/loginRequest.interface';
import { User } from '../auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl: string;
  private user?: User;


  private isLoginSubject = new BehaviorSubject<boolean>(true);
  isLogin$ = this.isLoginSubject.asObservable();

  constructor() {
    this.baseUrl = 'http://localhost:8080/auth';
  }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone ( this.user );
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
