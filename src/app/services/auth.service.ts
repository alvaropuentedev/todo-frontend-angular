import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRegisterRequest } from '../auth/interfaces/loginResgisterRequest.interface';
import { CookieService } from 'ngx-cookie-service';
import { AuthResponse } from '../auth/interfaces/authResponse.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private jwtHelper = inject(JwtHelperService);

  private baseUrl: string;

  private isLoginSubject = new BehaviorSubject<boolean>(true);
  private user?: string;
  public isLogin$ = this.isLoginSubject.asObservable();

  constructor() {
    // this.baseUrl = 'http://localhost:8080/auth';
    this.baseUrl = 'https://todo-backend-springboot-production.up.railway.app/auth';
  }

  get currentUser(): string | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  setLoginStatus(status: boolean) {
    this.isLoginSubject.next(status);
  }

  login(formValue: LoginRegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, formValue)
      .pipe(
        tap((user) => (this.user = user.username)),
        tap((user) => this.cookieService.set('user', user.username, {expires: 10})),
        tap((token) => this.cookieService.set('token', token.token, {expires: 10}))
      );
  }

  logout() {
    this.user = undefined;
    this.isLoginSubject.next(false);
    this.cookieService.deleteAll();
  }

  public isAuthenticated(): boolean {
    const token = this.cookieService.get('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(formValue: LoginRegisterRequest) {
    return this.http.post(`${this.baseUrl}/register`, formValue);
  }
  // login(username: string, password: string): Observable<User> {
  //   return this.http.put<User>(`${this.baseUrl}/login`, { username, password }).pipe(
  //     tap( user => this.user = user ),
  //     tap(user => localStorage.setItem('user', user.id.toString()))
  //   );
  // }
}
