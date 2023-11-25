import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  public isLogin = false;

  constructor() { }

  ngOnInit(): void {
    this.authService.isLogin$.subscribe((status) => {
      this.isLogin = status;
    });
  }
}
