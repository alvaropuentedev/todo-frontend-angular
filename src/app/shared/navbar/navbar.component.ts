import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  public isLogin!: boolean;
  public user = computed( () => this.authService.currentUser() );

  constructor() { }

  ngOnInit(): void {
    this.authService.isLogin$.subscribe((status) => {
      this.isLogin = status;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
