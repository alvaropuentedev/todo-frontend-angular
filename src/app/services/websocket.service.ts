import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, timer, Subscription } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { enviroment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket$: WebSocketSubject<any> | undefined;
  private connection$: Subject<any> = new Subject();
  private reconnectDelay = 3000;
  private reconnectSubscription?: Subscription;

  private readonly webSocketUrl: string = enviroment.websocket_url;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket$ = webSocket({
      url: this.webSocketUrl,
      openObserver: {
        next: () => {
          console.log('✅ WebSocket conectado');
        }
      },
      closeObserver: {
        next: () => {
          console.log('❌ WebSocket cerrado, reintentando...');
          this.reconnect();
        }
      }
    });

    this.socket$.subscribe({
      next: (msg) => this.connection$.next(msg),
      error: (err) => {
        console.error('WebSocket error:', err);
        this.reconnect();
      },
      complete: () => {
        console.log('WebSocket completado, reconectando...');
        this.reconnect();
      }
    });
  }

  private reconnect(): void {
    if (this.reconnectSubscription) {
      this.reconnectSubscription.unsubscribe();
    }
    this.reconnectSubscription = timer(this.reconnectDelay).subscribe(() => this.connect());
  }

  public sendMessage(message: any): void {
    this.socket$?.next(message);
  }

  public getMessages(): Observable<any> {
    return this.connection$.asObservable();
  }

  ngOnDestroy(): void {
    this.socket$?.complete();
    this.reconnectSubscription?.unsubscribe();
  }
}
