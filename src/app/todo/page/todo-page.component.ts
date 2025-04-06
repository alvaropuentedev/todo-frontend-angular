import { Component, OnInit, computed, inject, OnDestroy } from '@angular/core';
import { AddItemComponent } from '../components/add-item/add-item.component';
import { ListItemComponent } from '../components/list-item/list-item.component';
import { RouterModule } from '@angular/router';
import { Item } from 'src/app/interfaces';
import { Subscription } from 'rxjs';
import { TodoService } from 'src/app/services/todo.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { WebSocketService } from "../../services/websocket.service";

@Component({
  selector: 'app-todo-page',
  imports: [AddItemComponent, ListItemComponent, NavbarComponent, RouterModule],
  templateUrl: './todo-page.component.html'
})
export class TodoPageComponent implements OnInit, OnDestroy {
  private readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);
  private readonly webSocketService = inject(WebSocketService);

  public loading = true;
  public items: Item[] = [];
  public userID = computed(() => this.authService.currentUserID());
  public currentDate: Date;

  public $listSelectedTitle = this.todoService.$listTitle;
  private wsSubscription: Subscription | undefined;

  constructor() {
    this.currentDate = new Date();
  }
  ngOnInit() {
    // First load items
    this.loadItems();
    // Subscribe to WebSocket messages
    this.wsSubscription = this.webSocketService.getMessages().subscribe((message: string) => {
      console.log('WebSocket message received:', message);
      this.loadItems();
    });
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  loadItems() {
    this.todoService.getItemsByListId(this.todoService.$list_id()).subscribe({
      next: (itemsList) => {
        this.items = itemsList;
        this.loading = false;
        this.todoService.$showAddButton.set(true);
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading = false;
      }
    });
  }

}
