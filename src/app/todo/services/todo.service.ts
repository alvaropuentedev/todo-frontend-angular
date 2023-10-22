import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item.interfaces';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // private apiUrl: string = 'https://todo-backend-springboot-production.up.railway.app/api/todoitems'
  // private apiUrl: string = 'https://todo-backend-expressjs.vercel.app/api/items'
  private apiUrl: string = 'https://alvaropuentedev-todobackend-springboot.onrender.com/api/todoitems'


  constructor( private http: HttpClient) { }

  getItems(): Observable<Item> {
     return this.http.get<Item>(this.apiUrl);
  }

  getItemById( id: number ): Observable<Item> {
    return this.http.get<Item>(`${ this.apiUrl }/${id}`);
  }

  addItem( items: Item ): Observable<Item> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Item>(this.apiUrl, items, { headers });
  }

  deleteItem( id: number): Observable<Item> {
    return this.http.delete<Item>(`${ this.apiUrl }/${id}`)
  }
}
