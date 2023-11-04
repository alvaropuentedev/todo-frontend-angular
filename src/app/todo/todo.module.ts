import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemListComponent } from './components/list-item/list-item.component';
import { MainPageComponent } from './pages/main-page.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TODO_ROUTE } from './todo.router';



@NgModule({
  declarations: [
    MainPageComponent,
    ItemListComponent,
    AddItemComponent
  ],
  exports:[
    MainPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(TODO_ROUTE)
  ]
})
export class TodoModule { }
