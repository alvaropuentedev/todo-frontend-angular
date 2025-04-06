
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { enviroment } from "../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private readonly webSocketUrl: string = enviroment.websocket_url;
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket(this.webSocketUrl);
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  public getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }
}
