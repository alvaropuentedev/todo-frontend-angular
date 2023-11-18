import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private baseUrl: string;
  constructor() {
    this.baseUrl = 'http://localhost:8080/auth';
  }


  login(formValue: unknown) {
    return firstValueFrom(
      this.http.post<unknown>(`${ this.baseUrl }/login`, formValue)
    );
  }
}
