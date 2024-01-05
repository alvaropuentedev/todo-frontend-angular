import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { Item } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-todo-list-item',
  standalone: true,
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent {
  private readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);

  @Input() loading = true;
  @Input() items: Item[] = [];
  @Output() sharedLoadEvent = new EventEmitter<void>();

  public succes = false;
  public itemDescription = '';
  private userID = computed(() => this.authService.currentUserID());
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
    this.audio.src = '../../../../assets/audio/LetitgoDeleteSound.mp3';
  }

  deleteItem(item_id: number) {
    this.todoService.deleteItemByUserandItemId(this.userID(), item_id).subscribe(() => {
      this.todoService.onsharedLoad(this.sharedLoadEvent);
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
