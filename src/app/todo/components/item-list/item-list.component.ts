import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../interfaces/item.interfaces';

@Component({
  selector: 'todo-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit{

  public description: any = '';
  public items: Item[] = [];
  idItem: number = 2;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getItems()
      .subscribe(data => this.items = data)

    this.todoService.getItemById(this.idItem)
      .subscribe(items => this.description = items);
  }

}
