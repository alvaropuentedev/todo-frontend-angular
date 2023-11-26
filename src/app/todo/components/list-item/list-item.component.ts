import { Component, OnInit, inject } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { Item } from '../../interfaces/item.interface';

@Component({
  selector: 'app-todo-list-item',
  standalone: true,
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  public loading = true;
  public items: Item[] = [];
  public succes = false;
  public itemDescription = '';
  constructor() {
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
    this.todoService.getItems().subscribe((data: Item[]) => {
      this.items = data;
      this.loading = false;
    });
  }

  deleteItem(idItem: number, itemDescription: string) {
    this.todoService.deleteItem(idItem).subscribe(() => {
      this.todoService.getItems().subscribe((items) => {
        this.items = items;
        this.itemDescription = itemDescription;
      });
      this.handleSucces();
      this.audio.play();
    });
  }

  handleSucces() {
    this.succes = true;
    setTimeout( () => {
      this.succes = false;
    }, 2000);
  }
}
