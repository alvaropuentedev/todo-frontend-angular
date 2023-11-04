import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../interfaces/item.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-todo-item-list',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ItemListComponent implements OnInit {

  public loading = true;
  public items: Item[] = [];
  constructor(private todoService: TodoService) {
    this.audio = new Audio();
    this.audio.src = '../../../../assets/audio/LetitgoDeleteSound.mp3';
  }

  audio: HTMLAudioElement;
  ngOnInit(): void {
    this.loadItems();


    // this.todoService.getItemById(this.idItem!)
    //   .subscribe(items => this.description = items);

  }

  loadItems() {
    this.todoService.getItems()
      .subscribe((data: Item[]) => {
        this.items = data;
        this.loading = false;
      });
  }

  deleteItem(idItem: number) {
    this.todoService.deleteItem(idItem)
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          width: '50%',
          timer: 1000,
          showConfirmButton: false
        });
        this.todoService.getItems()
          .subscribe(items => this.items = items);
        this.audio.play();
      });
  }
}
