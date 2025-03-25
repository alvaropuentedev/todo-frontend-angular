import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';

import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-todo-add-item',
  imports: [ReactiveFormsModule, ButtonModule, Dialog, InputTextModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  private readonly todoService = inject(TodoService);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  @Output() sharedLoadEvent = new EventEmitter<void>();
  public userID = computed(() => this.authService.currentUserID());
  public $showAddButton = this.todoService.$showAddButton;

  public item: Item = {
    id: 0,
    description: ' ',
  };

  public addItemForm = this.fb.group({
    description: [' ', Validators.required],
  });

  public showModal = false;

  constructor() {
  }

  handleFocus(event: any, inputEl: any) {
    inputEl.focus();
  }

  showDialog() {
    this.todoService.hapticsImpactVibration();
    this.addItemForm.reset();
    this.showModal = true;
  }

  submitForm() {
    const description = this.addItemForm.value.description;
    if (description && description.trim() !== '') {
      const item: Item = {
        id: 0,
        description: description.toLocaleLowerCase().trim(),
      };
      this.todoService.addItem(this.todoService.$list_id(), item).subscribe({
        next: () => {
          this.addItemForm.reset();
          this.todoService.onsharedLoad(this.sharedLoadEvent);
          this.showModal = false;
        },
        error: () => {
          console.error('Duplicate description');
          this.showModal = false;
        },
      });
    } else {
      console.error('ERROR description is undefined or null');
    }
  }
}
