import { Component } from '@angular/core';
import { AddItemComponent } from '../components/add-item/add-item.component';
import { ListItemComponent } from '../components/list-item/list-item.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [ AddItemComponent, ListItemComponent, RouterModule ],
  templateUrl: './todo-page.component.html'
})

export class TodoPageComponent {


}
