import { Component, OnInit, computed, inject } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { Item } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { interval, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-todo-list-item',
  standalone: true,
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);

  public loading = true;
  public items: Item[] = [];
  public succes = false;
  public itemDescription = '';
  public userID = computed(() => this.authService.currentUserID());

  constructor() {
    this.audio = new Audio();
    this.audio.src = '../../../../assets/audio/LetitgoDeleteSound.mp3';
  }

  audio: HTMLAudioElement;
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
        switchMap(() => this.todoService.getItemsByUserId(this.userID()))
      )
      .subscribe({
        next: itemsList => {
          this.items = itemsList;
          this.loading = false;
        },
      });
  }

  deleteItem(idItem: number, itemDescription: string) {
    this.todoService.deleteItem(idItem).subscribe(() => {
      this.todoService.getItemsByUserId(this.userID()).subscribe(items => {
        this.items = items;
        this.itemDescription = itemDescription;
      });
      this.handleSucces();
      this.audio.play();
    });
  }

  handleSucces() {
    this.succes = true;
    setTimeout(() => {
      this.succes = false;
    }, 2000);
  }
}
