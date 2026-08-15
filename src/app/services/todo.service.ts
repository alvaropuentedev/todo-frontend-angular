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

  // Vibration function with fallback
  async hapticsImpactVibration() {
    try {
      await Haptics.notification();
    } catch (error) {
      console.log('Haptics not available');
    }
  }

  async hapticsDeleteSound() {
    try {
      await Haptics.notification();
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // RUSTLE - fricción del papel (sonido suave descendente)
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(600, audioContext.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.25);
      gain1.gain.setValueAtTime(0.15, audioContext.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 0.25);
      osc1.start(audioContext.currentTime);
      osc1.stop(audioContext.currentTime + 0.25);
      
      // THUD PROFUNDO - cae en papelera (sonido muy grave)
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(200, audioContext.currentTime + 0.27);
      osc2.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.38);
      gain2.gain.setValueAtTime(0.4, audioContext.currentTime + 0.27);
      gain2.gain.exponentialRampToValueAtTime(0, audioContext.currentTime + 0.38);
      osc2.start(audioContext.currentTime + 0.27);
      osc2.stop(audioContext.currentTime + 0.38);
      
    } catch (error) {
      console.log('Audio no disponible');
    }
  }

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
