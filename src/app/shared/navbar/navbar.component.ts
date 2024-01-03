import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  public user = computed( () => this.authService.currentUser() );
  public userStatus = computed( () => this.authService.authStatus() );

  constructor() { }

  logout() {
    this.authService.logout();
  }
}
