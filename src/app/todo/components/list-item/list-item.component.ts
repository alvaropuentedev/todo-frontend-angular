import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { Item } from 'src/app/interfaces';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-todo-list-item',
  standalone: true,
  imports: [ToastModule, CardModule],
  providers: [MessageService],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent {
  private readonly todoService = inject(TodoService);
  private readonly messageService = inject(MessageService);

  @Input() loading = true;
  @Input() items: Item[] = [];
  @Output() sharedLoadEvent = new EventEmitter<void>();

  public succes = false;
  public itemDescription = '';
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
    this.audio.src = 'assets/audio/LetitgoDeleteSound.mp3';
  }

  deleteItem(item_id: number, description: string) {
    this.todoService.deleteItem(item_id).subscribe(() => {
      this.itemDescription = description;
      this.todoService.onsharedLoad(this.sharedLoadEvent);
      this.showSuccessMessage();
      this.audio.play();
    });
  }

  showSuccessMessage() {
    this.messageService.add({
      key: 'toastSucces',
      severity: 'success',
      summary: 'Completado!',
      detail: this.itemDescription,
    });
  }
}
