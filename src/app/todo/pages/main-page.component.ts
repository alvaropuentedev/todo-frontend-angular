import { Component } from '@angular/core';
import { AddItemComponent } from '../components/add-item/add-item.component';
import { ItemListComponent } from '../components/list-item/list-item.component';

@Component({
  selector: 'app-todo-main-page',
  standalone: true,
  imports: [ AddItemComponent, ItemListComponent ],
  templateUrl: './main-page.component.html'
})

export class MainPageComponent {


}
