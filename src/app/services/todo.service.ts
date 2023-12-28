import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, interval, map, startWith, switchMap } from 'rxjs';
import { enviroment } from 'src/environments/environments';
import { Item } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  // private readonly baseUrl: string = 'http://localhost:8080';
  private readonly baseUrl: string = enviroment.base_url;

  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  constructor() {
    this.fetchItems();
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
        const updatedItems = currentItems.filter(item => item.id_item !== id);
        this.itemsSubject.next(updatedItems);
      })
    );
  }

  private fetchItems() {
    // Create an observable that emits a value every 30 seconds
    const fetchInterval$ = interval(30000);
    // Combine the immediate first load and then updates every 30 seconds
    fetchInterval$
      .pipe(
        // Emit an initial value of 0 for the immediate first load
        startWith(0),
        // Make call HTTP GET to the URL `${this.baseUrl}/api/todoitems`
        switchMap(() => this.http.get<Item[]>(`${this.baseUrl}/api/todoitems`))
      )
      .subscribe(items => {
        // When the data is received, emit it through the "itemsSubject" object
        this.itemsSubject.next(items);
      });
  }
}
