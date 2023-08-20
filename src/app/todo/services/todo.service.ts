import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item.interfaces';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor( private http: HttpClient) { }

  getItems(): Observable<Item[]> {
     return this.http.get<Item[]>('http://localhost:3000/api/items');
  }

  getItemById( id: number ): Observable<Item> {
    return this.http.get<Item>(`http://localhost:3000/api/items/${id}`);
  }

  addItem( item: Item ): Observable<Item> {
    return this.http.post<Item>('http://localhost:3000/api/items', item);
  }

  deleteItem( id: number): Observable<boolean> {
    return this.http.delete(`http://localhost:3000/api/items/${id}`)
      .pipe(
        catchError( err => of(false) ),
        map( resp => true )
      );
  }
}
