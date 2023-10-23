import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../interfaces/item.interface';
import { ItemListComponent } from '../list-item/list-item.component';
import { AddItem } from '../../interfaces/addItem.interface';

@Component({
  selector: 'todo-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {

  public item: AddItem = {
    id_item: 0,
    description: ''
  };

  constructor(private todoService: TodoService) { }

  submitForm(): void {
    if (this.item.description.length === 0) return;
    this.todoService.addItem(this.item)
      .subscribe(res => {
        window.location.reload();
      });
    this.item.description = '';
  }

}
