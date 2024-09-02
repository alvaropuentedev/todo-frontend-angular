import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { EventEmitter, Injectable, inject, signal } from '@angular/core';
import {catchError, Observable, of, throwError} from 'rxjs';
import { enviroment } from 'src/environments/environments';
import { Item } from '../interfaces';
import { List } from '../interfaces/list.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  // private readonly baseUrl: string = enviroment.base_url;
  private readonly baseUrl: string = 'http://localhost:8080/apitodo';

  public $showAddButton = signal(false);

  public listTitleFromStorage: string | null = localStorage.getItem('list_title');
  public $listTitle = signal(this.listTitleFromStorage !== null ? this.listTitleFromStorage : '');

  public listIdFromStorage: string | null = localStorage.getItem('list_id');
  public listIdAsNumber: number = this.listIdFromStorage !== null ? Number(this.listIdFromStorage) : 0;
  public $list_id = signal(this.listIdAsNumber);


  constructor() { }

  setListId(listId: number) {
    this.$list_id.set(listId);
    localStorage.setItem('list_id', listId.toString());
  }
  
  getItemsByListId(list_id: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/list/${list_id}/items`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Handle 404 error
          console.error(`List with id ${list_id} not found.`);
          localStorage.removeItem('list_title');
          localStorage.removeItem('list_id');
          location.reload();
          return of([]); // Return an empty array or handle as needed
        } else {
          // Handle other errors
          return throwError(() => new Error('An error occurred'));
        }
      })
    );
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
