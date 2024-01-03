import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { enviroment } from 'src/environments/environments';
import { Item } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  // private readonly baseUrl: string = enviroment.base_url;
  private readonly baseUrl: string = 'http://localhost:8080';

  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  constructor() {}

  getItemsByUserId(userID: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/api/user/${userID}/items`);
  }

  addItem(data: Item): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/api/todoitems`, data).pipe(
      map((item: Item) => {
        const currentItems = this.itemsSubject.value;
        currentItems.push(item);
        this.itemsSubject.next(currentItems);
        return item;
      }),
      catchError(() => {
        throw new Error('Ocurrió un error al agregar el elemento');
      })
    );
  }

  deleteItem(id: number): Observable<unknown> {
    return this.http.delete<Item>(`${this.baseUrl}/api/todoitems/${id}`).pipe(
      map(() => {
        const currentItems = this.itemsSubject.value;
        const updatedItems = currentItems.filter(item => item.item_id !== id);
        this.itemsSubject.next(updatedItems);
      })
    );
  }

}
