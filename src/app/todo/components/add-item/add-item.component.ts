import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-todo-add-item',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent {
  private readonly todoService  = inject(TodoService);
  private readonly fb           = inject(FormBuilder);
  private readonly authService  = inject(AuthService);

  @Output() sharedLoadEvent = new EventEmitter<void>();
  public userID = computed(() => this.authService.currentUserID());

  public item: Item = {
    id: 0,
    description: ' ',
  };

  public addItemForm = this.fb.group({
    description: [' ', Validators.required],
  });

  constructor() {}

  submitForm() {
    const description = this.addItemForm.value.description;
    if (description && description.trim() !== '') {
      const item: Item = {
        id: 0,
        description: description,
      };
      this.todoService.addItem(this.userID(), item).subscribe({
        next: () => {
          this.addItemForm.reset();
          this.todoService.onsharedLoad(this.sharedLoadEvent);
        },
        error: () => {
          console.error('Duplicate description');
        },
      });
    } else {
      console.error('ERROR description is undefined or null');
    }
  }
}
