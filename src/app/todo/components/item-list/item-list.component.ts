import { AddItemComponent } from './../add-item/add-item.component';
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../interfaces/item.interfaces';

@Component({
  selector: 'todo-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit{

  public description: string = '';
  public items: Item[] = [];
  public item: Item = {
    id_item: 0,
    description: ''
  };
  constructor(private todoService: TodoService) {
     this.audio = new Audio();
     this.audio.src = '../../../../assets/LetitgoDeleteSound.mp3';
  }

  audio: HTMLAudioElement;
  ngOnInit(): void {
    setTimeout(() => {
      location.reload();
    }, 60000); // 30 minutos * 60 segundos * 1000 ms 1800000
    this.todoService.getItems()
    .subscribe(data => this.items = data)



    // this.todoService.getItemById(this.idItem!)
    //   .subscribe(items => this.description = items);

  }

  deleteItem(idItem: number) {
    this.todoService.deleteItem(idItem)
      .subscribe(() => {
        this.todoService.getItems()
            .subscribe(items => this.items = items);
        this.audio.play();
    });
  }
}
