import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/environments';
import { Item } from '../interfaces';
import { List } from '../interfaces/list.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl: string = enviroment.base_url;
  // private readonly baseUrl: string = 'http://localhost:8080/apitodo';

  public $list_id = signal(0);
  public $showAddButton = signal(false);
  public $listTitle = signal('');


  constructor() { }

  setListId(listId: number) {
    this.$list_id.set(listId);
  }

  getItemsByListId(list_id: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/list/${list_id}/items`);
  }


  addItem(list_id: number, body: Item): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/list/${list_id}/items`, body);
  }

  deleteItem(item_id: number): Observable<unknown> {
    return this.http.delete<Item>(`${this.baseUrl}/item/${item_id}`);
  }

  // GET lists
  getListByUserId(userID: number): Observable<List[]> {
    return this.http.get<List[]>(`${this.baseUrl}/user/${userID}/lists`);
  }

  createListForUser(user_id: number, body: List): Observable<List> {
    return this.http.post<List>(`${this.baseUrl}/user/${user_id}/list`, body);
  }

  deleteList(list_id: number): Observable<unknown> {
    return this.http.delete<Item>(`${this.baseUrl}/list/${list_id}`);
  }

  onsharedLoad(sharedLoadEventToEmit: EventEmitter<void>) {
    sharedLoadEventToEmit.emit();
  }
}
