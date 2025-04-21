import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { AddItemComponent } from '../components/add-item/add-item.component';
import { ListItemComponent } from '../components/list-item/list-item.component';
import { RouterModule } from '@angular/router';
import { Item } from 'src/app/interfaces';
import { Subscription } from 'rxjs';
import { TodoService } from 'src/app/services/todo.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { WebSocketService } from "../../services/websocket.service";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-todo-page',
  imports: [AddItemComponent, ListItemComponent, NavbarComponent, RouterModule, OverlayBadgeModule],
  templateUrl: './todo-page.component.html'
})
export class TodoPageComponent implements OnInit, OnDestroy {
  private readonly todoService = inject(TodoService);
  private readonly webSocketService = inject(WebSocketService);
  private readonly authService = inject(AuthService);

  public loading = true;
  public items: Item[] = [];
  public currentDate: Date;

  public $listSelectedTitle = this.todoService.$listTitle;
  private wsSubscription: Subscription | undefined;
  private focusHandler?: () => void;
  public mobileView = window.innerWidth <= 768; // check mobil screen
  public authStatus= this.authService.authStatus();
  
  constructor() {
    this.currentDate = new Date();
    this.loadItems();
  }

  ngOnInit() {
    const focusHandler = () => {
      console.log('🔄 Focus first load');
      this.loadItems();
    };

    // Load items when the component is initialized and when the window gains focus
    window.addEventListener('focus', focusHandler);
    this.focusHandler = focusHandler;

    // ✅ WebSocket
    this.wsSubscription = this.webSocketService.getMessages().subscribe((message: string) => {
      console.log('WebSocket message received:', message);
      this.loadItems();
    });
  }

  // Change the badge color based on the number of items
  getBadgeSeverity(): 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' {
    const count = this.items.length;

    if (count <= 3) {
      return 'success'; // green
    } else if (count <= 6) {
      return 'info'; // blue
    } else if (count <= 10) {
      return 'warn'; // orange
    } else {
      return 'danger'; // red
    }
  }



  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    if (this.focusHandler) {
      window.removeEventListener('focus', this.focusHandler);
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
