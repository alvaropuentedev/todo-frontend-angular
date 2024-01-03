import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map } from 'rxjs';
import { enviroment } from 'src/environments/environments';
import { Item } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl: string = enviroment.base_url;
  // private readonly baseUrl: string = 'http://localhost:8080';

  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  private itemListSubject = new Subject<unknown>();

  constructor() {}

  getItemsByUserId(userID: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/api/user/${userID}/items`);
  }

  addItem(usserID: number, body: Item): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/api/user/${usserID}/items`, body).pipe(
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

  deleteItem(userID: number, itemID: number): Observable<unknown> {
    return this.http.delete<Item>(`${this.baseUrl}/api/user/${userID}/items/${itemID}`);
  }

  getNewLoadItemListEvent() {
    return this.itemListSubject.asObservable();
  }

  sendNewLoadItemListEvent() {
    return this.itemListSubject.next(null);
  }

}
