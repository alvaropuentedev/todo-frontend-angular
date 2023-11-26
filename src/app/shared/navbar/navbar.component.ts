import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  public isLogin!: boolean;

  constructor() { }


  ngOnInit(): void {
    this.authService.isLogin$.subscribe((status) => {
      this.isLogin = status;
    });
  }

  handleLoginStatus() {
    this.isLogin = false;
    this.cookieService.delete('token', '/');
    this.router.navigate(['/auth/login']);
  }
}
