import { Component, inject } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../interfaces/item.interface';

@Component({
  selector: 'app-todo-add-item',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent {
  private readonly todoService = inject(TodoService);
  private readonly fb = inject(FormBuilder);

  public item: Item = {
    id_item: 0,
    description: ' ',
  };

  public addItemForm = this.fb.group({
    description: [' ', Validators.required],
  });

  constructor() {}

  submitForm() {
    const description = this.addItemForm.value.description;
    if (description && description.trim() !== '') {
      const items: Item = {
        id_item: 0,
        description: description,
      };
      this.todoService.addItem(items).subscribe(() => {
        this.addItemForm.reset();
      });
    } else {
      console.error('ERROR description is undefined or null');
    }
  }
}
