import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor( private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    //  return this.http.get<Item[]>('http://localhost:8080/api/todoitems');
     return this.http.get<Item[]>('https://bruckecloud.asuscomm.com:8080/api/todoitems');
  }

  getFetch() {
    fetch('http://localhost:8080/api/todoitems')
    .then(resp => resp.json)
    .then(data => console.log(data))
  }

}
