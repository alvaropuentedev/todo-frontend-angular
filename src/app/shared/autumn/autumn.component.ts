import { Component } from '@angular/core';
import {ToggleButtonModule} from "primeng/togglebutton";

@Component({
    selector: 'app-autumn',
    imports: [ToggleButtonModule],
    templateUrl: './autumn.component.html',
    styleUrl: './autumn.component.css'
})
export class AutumnComponent {
  private autumnAudio: HTMLAudioElement;
  private togglePlayButton = true;

  constructor() {
    this.autumnAudio = new Audio();
    this.autumnAudio.src = 'assets/audio/TheAutumn.mp3';
    this.autumnAudio.volume = 0.03;
  }

  playMusic() {
    this.togglePlayButton  = !this.togglePlayButton;
    if (this.togglePlayButton) {
      this.autumnAudio.pause();
    } else {
      this.autumnAudio.play();
    }
  }
}
