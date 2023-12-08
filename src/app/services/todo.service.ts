import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Item } from '../todo/interfaces/item.interface';
import { BehaviorSubject, Observable, catchError, interval, map } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrl;

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
  // Método para cargar la lista de elementos al inicializar el servicio
  private fetchItems() {
    this.http.get<Item[]>(`${this.baseUrl}/api/todoitems`).subscribe(items => {
      this.itemsSubject.next(items);
      interval(30000).subscribe(() => this.fetchItems());
    });
  }
}
