import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item.interface';
import { BehaviorSubject, Observable, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl =
    'https://todo-backend-springboot-production.up.railway.app/api/todoitems';
  // private apiUrl: string = 'https://todo-backend-expressjs.vercel.app/api/items'
  // private apiUrl: string = 'http://localhost:8080/api/todoitems'
  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>(
    []
  );

  constructor(private http: HttpClient) {
    this.fetchItems();
  }

  getItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  addItem(data: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, data).pipe(
      map((item) => {
        const currentItems = this.itemsSubject.value;
        currentItems.push(item);
        this.itemsSubject.next(currentItems);
        return item;
      })
    );
  }

  deleteItem(id: number): Observable<unknown> {
    return this.http.delete<Item>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        const currentItems = this.itemsSubject.value;
        const updatedItems = currentItems.filter((item) => item.id_item !== id);
        this.itemsSubject.next(updatedItems);
      })
    );
  }
  // Método para cargar la lista de elementos al inicializar el servicio
  private fetchItems() {
    this.http.get<Item[]>(this.apiUrl).subscribe((items) => {
      this.itemsSubject.next(items);
      interval(30000).subscribe(() => this.fetchItems());
    });
  }
}
