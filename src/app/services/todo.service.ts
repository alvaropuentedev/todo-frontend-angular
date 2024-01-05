import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/environments';
import { Item } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl: string = enviroment.base_url;
  // private readonly baseUrl: string = 'http://localhost:8080';

  constructor() {}

  getItemsByUserId(userID: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/api/user/${userID}/items`);
  }

  addItem(usserID: number, body: Item): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/api/user/${usserID}/items`, body);
  }

  deleteItemByUserandItemId(userID: number, itemID: number): Observable<unknown> {
    return this.http.delete<Item>(`${this.baseUrl}/api/user/${userID}/items/${itemID}`);
  }

  onsharedLoad(sharedLoadEventToEmit: EventEmitter<void>) {
    sharedLoadEventToEmit.emit();
  }
}
