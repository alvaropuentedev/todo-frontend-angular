import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User, AuthStatus, LoginResponse, LoginRegisterRequest } from '../interfaces';
import { TodoService } from './todo.service';
import { enviroment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http         = inject(HttpClient);
  private readonly jwtHelper    = inject(JwtHelperService);
  private readonly router       = inject(Router);
  private readonly todoService  = inject(TodoService);
  private readonly baseUrl: string = enviroment.base_url;
  // private readonly baseUrl: string = 'http://localhost:8080';

  private _currentUser = signal<User | null>(null);
  private _currentUserID = signal(0);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Exposed
  public currentUser = computed(() => this._currentUser());
  public currentUserID = computed(() => this._currentUserID());
  public authStatus = computed(() => this._authStatus());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public userID: any;

  constructor() {
    this.checkTokenIsActive().subscribe();
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { username, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap(({ id_user, username, token }) => {
        this.user = username;
        this.userID = id_user;
        this._currentUserID.set(id_user);
        this._currentUser.set(username);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        localStorage.setItem('user', this.user);
        localStorage.setItem('id', this.userID);
      }),
      map(() => true),

      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  logout() {
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    this.router.navigateByUrl('/auth/login');
  }

  public checkTokenIsActive(): Observable<boolean> {
    const token     = localStorage.getItem('token');
    const user      = localStorage.getItem('user');
    const userID    = localStorage.getItem('id');
    this.user = user;
    this.userID = userID;
    const checkToken = this.jwtHelper.isTokenExpired(token);

    // If token is not expired user continue logged
    if (!checkToken) {
      this._currentUserID.set(this.userID);
      this._currentUser.set(this.user);
      this._authStatus.set(AuthStatus.authenticated);
      this.router.navigateByUrl('/todo/list');
      return of(true);
    }
    this.logout();
    this._authStatus.set(AuthStatus.notAuthenticated);
    return of(false);
  }

  register(formValue: LoginRegisterRequest) {
    return this.http.post(`${this.baseUrl}/auth/register`, formValue);
  }
}
