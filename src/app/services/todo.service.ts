import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { enviroment } from 'src/environments/environments';
import { Item } from '../interfaces';
import { List } from '../interfaces/list.interface';
import { Haptics, ImpactStyle } from "@capacitor/haptics";

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl: string = enviroment.base_url;

  public $showAddButton = signal(false);

  public listTitleFromStorage: string | null = localStorage.getItem('list_title');
  public $listTitle = signal(this.listTitleFromStorage !== null ? this.listTitleFromStorage : '');

  public listIdFromStorage: string | null = localStorage.getItem('list_id');
  public listIdAsNumber: number = this.listIdFromStorage !== null ? Number(this.listIdFromStorage) : 0;
  public $list_id = signal(this.listIdAsNumber);
  public drawerVisibleSignal = signal(false);


  constructor() {
  }

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
          return of([]);
        } else {
          // Handle other errors
          return throwError(() => new Error('An error occurred'));
        }
      })
    );
  }

  handleFocus(event: any, inputEl: any) {
    inputEl.focus();
  }

  // Vibration function
  hapticsImpactVibration = async () => {
    await Haptics.impact({style: ImpactStyle.Heavy});
  };

  // ITEMS
  addItem(list_id: number, body: Item): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/list/${list_id}/items`, body);
  }

  updateItemDescription(list_id: number, item_id: number, body: Item): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/list/${list_id}/${item_id}/items`, body);
  }

  deleteItem(item_id: number): Observable<unknown> {
    return this.http.delete<Item>(`${this.baseUrl}/item/${item_id}`);
  }

  // LISTS
  getListByUserId(userID: number): Observable<List[]> {
    return this.http.get<List[]>(`${this.baseUrl}/user/${userID}/lists`);
  }

  createListForUser(user_id: number, body: List): Observable<List> {
    return this.http.post<List>(`${this.baseUrl}/user/${user_id}/list`, body);
  }

  deleteList(user_id: number, list_id: number): Observable<unknown> {
    return this.http.delete<Item>(`${this.baseUrl}/user/${user_id}/list/${list_id}`);
  }

  addUsersToList(list_id: number, user: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/list/${list_id}/user`, user);
  }

  onsharedLoad(sharedLoadEventToEmit: EventEmitter<void>) {
    sharedLoadEventToEmit.emit();
  }
}
