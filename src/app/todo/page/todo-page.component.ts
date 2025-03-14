import { Component, OnInit, computed, inject } from '@angular/core';
import { AddItemComponent } from '../components/add-item/add-item.component';
import { ListItemComponent } from '../components/list-item/list-item.component';
import { RouterModule } from '@angular/router';
import { Item } from 'src/app/interfaces';
import { interval, startWith, switchMap } from 'rxjs';
import { TodoService } from 'src/app/services/todo.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import {AutumnComponent} from "../../shared/autumn/autumn.component";
import {SnowFallComponent} from "../../shared/snow-fall/snow-fall.component";

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [AddItemComponent, ListItemComponent, NavbarComponent, RouterModule, AutumnComponent, SnowFallComponent],
  templateUrl: './todo-page.component.html',
})
export class TodoPageComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);

  public loading = true;
  public items: Item[] = [];
  public userID = computed(() => this.authService.currentUserID());
  public currentDate: Date;

  public $listSelectedTitle = this.todoService.$listTitle;

  constructor() {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    // Create an observable that emits a value every 30 seconds
    const fetchInterval$ = interval(30000);
    // Combine the immediate first load and then updates every 30 seconds

    fetchInterval$
      .pipe(
        // Emit an initial value of 0 for the immediate first load
        startWith(0),
        // Make call HTTP GET to the URL `${this.baseUrl}/api/user/${userId}/items`
        switchMap(() => this.todoService.getItemsByListId(this.todoService.$list_id()))
      )
      .subscribe({
        next: itemsList => {
          this.items = itemsList;
          this.loading = false;
          this.todoService.$showAddButton.set(true);
        },
      });
  }

}
