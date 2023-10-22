import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Item } from '../../interfaces/item.interfaces';
import Swal from 'sweetalert2'

@Component({
  selector: 'todo-item-list',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ItemListComponent implements OnInit{

  public items: Item = { items: [] };
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
    setTimeout(() => {
      location.reload();
    }, 60000); // 30 minutos * 60 segundos * 1000 ms 1800000
    this.todoService.getItems()
    .subscribe((data: Item) => {
      this.items = data;
      console.log(this.items)

    })
  }

  deleteItem(idItem: number) {
    this.todoService.deleteItem(idItem)
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          width: '50%',
          timer: 1000,
          showConfirmButton: false
        })
        this.todoService.getItems()
            .subscribe(items => this.items = items);
        this.audio.play();
    });
  }
}
