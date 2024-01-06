import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AvatarModule, MenuModule, SidebarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());
  public userStatus = computed(() => this.authService.authStatus());

  menuOptions: MenuItem[] | null = [];
  sidebarVisible: boolean = false;

  constructor() {}

  ngOnInit() {
    this.menuOptions = [
      {
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];
  }

  logout() {
    this.sidebarVisible = false;
    this.authService.logout();
  }
}
