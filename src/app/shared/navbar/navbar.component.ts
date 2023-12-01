import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  public readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  public isLogin!: boolean;
  // TODO Check

  constructor() { }

  ngOnInit(): void {
    this.authService.isLogin$.subscribe((status) => {
      this.isLogin = status;
    });
  }
  get user():string | undefined {
    return this.authService.currentUser;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
