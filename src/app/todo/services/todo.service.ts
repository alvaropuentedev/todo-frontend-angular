import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item.interfaces';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // private apiUrl: string = 'https://todo-backend-springboot-production.up.railway.app/api/todoitems'
  private apiUrl: string = 'https://todo-backend-expressjs.vercel.app//api/todoitems'

  constructor( private http: HttpClient) { }

  getItems(): Observable<Item[]> {
     return this.http.get<Item[]>(this.apiUrl);
  }

  getItemById( id: number ): Observable<Item> {
    return this.http.get<Item>(`${ this.apiUrl }/${id}`);
  }

  addItem( item: Item ): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  deleteItem( id: number): Observable<Item> {
    return this.http.delete<Item>(`${ this.apiUrl }/${id}`)
  }
}
