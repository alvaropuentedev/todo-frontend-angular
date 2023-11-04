import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../../interfaces/item.interface';

@Component({
  selector: 'app-todo-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {

  public item: Item = {
    id_item: 0,
    description: ''
  };

  public addItemForm: FormGroup = this.fb.group({
    description: [ '', Validators.required ]
  });

  constructor(private todoService: TodoService, private fb: FormBuilder) { }

  submitForm(): void {
    this.item = this.addItemForm.value;
    this.todoService.addItem(this.item)
      .subscribe(() => {
        this.addItemForm.reset();
      });
  }

}
