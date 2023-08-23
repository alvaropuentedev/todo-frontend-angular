import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../interfaces/item.interfaces';

@Component({
  selector: 'todo-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {

  public item: Item = {
    id_item: 0,
    description: ''
  };

  constructor(private todoService: TodoService) {}

  submitForm():void{
    if ( this.item.description.length === 0) return;
      this.todoService.addItem(this.item)
        .subscribe(response => {
          window.location.reload();
        });
      this.item.description = '';
  }

}
