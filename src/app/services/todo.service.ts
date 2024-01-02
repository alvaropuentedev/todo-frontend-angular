import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, interval, map, startWith, switchMap } from 'rxjs';
import { enviroment } from 'src/environments/environments';
import { Item, User } from '../interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  // private readonly baseUrl: string = enviroment.base_url;
  private readonly baseUrl: string = 'http://localhost:8080';

  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  private currentUserID = this.authService.userID;

  constructor() {
    this.fetchItems(this.currentUserID);
  }

  getItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/api/todoitems/${id}`);
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

  private fetchItems(userId: any) {
    // Create an observable that emits a value every 30 seconds
    const fetchInterval$ = interval(30000);
    // Combine the immediate first load and then updates every 30 seconds
    fetchInterval$
      .pipe(
        // Emit an initial value of 0 for the immediate first load
        startWith(0),
        // Make call HTTP GET to the URL `${this.baseUrl}/api/todoitems`
        switchMap(() => this.http.get<Item[]>(`${this.baseUrl}/api/user/${userId}/items`))
      )
      .subscribe(items => {
        // When the data is received, emit it through the "itemsSubject" object
        this.itemsSubject.next(items);
      });
  }
}
