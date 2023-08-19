import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../interfaces/item.interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'todo-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit{

  public items: Item[] = [];
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getItems()
      .subscribe(items => this.items = items);
  }

}
