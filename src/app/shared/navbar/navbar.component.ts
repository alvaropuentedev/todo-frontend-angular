import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Signal, computed, inject, signal } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TodoService } from 'src/app/services/todo.service';
import { List } from 'src/app/interfaces/list.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AvatarModule, MenuModule, SidebarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly todoService = inject(TodoService);
  
  @Output() sharedLoadEvent = new EventEmitter<void>();

  public user = computed(() => this.authService.currentUser());
  public userStatus = computed(() => this.authService.authStatus());
  public userID = computed(() => this.authService.currentUserID());


  menuOptions: MenuItem[] | null = [];
  sidebarVisible: boolean = false;

  public lists: List[] = [];

  constructor() { }

  ngOnInit() {
    this.menuOptions = [
      {
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];
    this.loadLists();
  }

  loadLists() {
    this.todoService.getListByUserId(this.userID())
      .subscribe({
        next: (list: List[]) => {
          this.lists = list;
        }
      });
  }

  logout() {
    this.sidebarVisible = false;
    this.authService.logout();
  }

  showItemsFromList(listId: number) {
    this.sidebarVisible = false;
    this.todoService.$showAddButton.set(true);
    this.todoService.setListId(listId);
    this.todoService.onsharedLoad(this.sharedLoadEvent);
  }

}
