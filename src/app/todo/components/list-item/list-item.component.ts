import {Component, EventEmitter, Input, Output, inject, ViewChild, ElementRef} from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { Item } from 'src/app/interfaces';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-todo-list-item',
  standalone: true,
  imports: [ToastModule, CardModule, ReactiveFormsModule, InputTextModule],
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
  @ViewChild('editInput') editInput: ElementRef | undefined;

  public itemDescription = '';
  private audio: HTMLAudioElement;
  public isEditing = false;
  public editingItemId: number | null = null;

  constructor() {
    this.audio = new Audio();
    this.audio.src = 'assets/audio/LetitgoDeleteSound.mp3';
  }

  itemControl = new FormControl('');
  editItem(item: Item) {
    this.isEditing = true;
    this.editingItemId = item.id;
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
      }
    }, 0);
    this.itemControl.patchValue(item.description.toLocaleUpperCase());
  }

  updateItemDescription(item: Item) {
    item.description = this.itemControl.value?.trim().toLocaleLowerCase() ?? '';
    this.todoService.updateItemDescription(this.todoService.$list_id(),item.id, item).subscribe({
      next: () => {
        this.isEditing = false;
      }
    });
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
