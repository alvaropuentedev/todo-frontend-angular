import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../interfaces/item.interfaces';
import { ItemListComponent } from '../list-item/list-item.component';

@Component({
  selector: 'todo-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {

  public itemDescription: string = ''


  constructor(private todoService: TodoService) { }

  submitForm(): void {
    if (this.itemDescription.length === 0) return;
    const items: Item = {
      items: [
        {
          id_item: 0,
          description: this.itemDescription
        }
      ]
    };
    console.log(this.itemDescription)
    this.todoService.addItem(items)
      .subscribe(( response: Item ) => {
        console.log(items)
        console.log(response)
        // window.location.reload();
      });
     this.itemDescription = '';
  }

}
