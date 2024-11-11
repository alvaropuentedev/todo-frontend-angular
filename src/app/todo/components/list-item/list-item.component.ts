import {Component, EventEmitter, Input, Output, inject, ViewChild, ElementRef} from '@angular/core';
import {TodoService} from '../../../services/todo.service';
import {Item} from 'src/app/interfaces';

import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
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
    if (item.description.trim().toLocaleLowerCase() != this.itemControl.value!.trim().toLocaleLowerCase() &&
      this.itemControl.value!.trim().toLocaleLowerCase() != '') {
      item.description = this.itemControl.value?.trim().toLocaleLowerCase() ?? '';
      this.todoService.updateItemDescription(this.todoService.$list_id(), item.id, item).subscribe({
        next: () => {
          this.isEditing = false;
        }
      });
    }
    this.isEditing = false;
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

  private pressTimers: { [key: string]: any } = {}; // Stores timers for each item ID
  public progressMap: { [key: string]: number } = {}; // Stores progress for each item ID

  startPress(item_id: number, description: string): void {
    this.progressMap[item_id] = 0; // Resets the progress for the specific item
    const duration = 1500; // Duration in milliseconds (1.5 seconds)
    const startTime = Date.now();

    this.pressTimers[item_id] = setInterval(() => {
      const elapsed = Date.now() - startTime; // Calculate elapsed time
      this.progressMap[item_id] = (elapsed / duration) * 100; // Update progress based on elapsed time

      if (elapsed >= duration) {
        clearInterval(this.pressTimers[item_id]); // Stop the timer once the duration is reached
        this.deleteItem(item_id, description); // Call the delete item function when the duration is over
      }
    }, 16); // Approximate 60 FPS for smooth updates
  }

  cancelPress(item_id: number): void {
    clearInterval(this.pressTimers[item_id]); // Stop the timer if the user cancels the press
    this.progressMap[item_id] = 0; // Reset the progress for the specific item
  }

}
