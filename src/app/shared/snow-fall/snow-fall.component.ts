import {Component} from '@angular/core';
import {ToggleButtonModule} from "primeng/togglebutton";

@Component({
    selector: 'app-snowfall',
    imports: [
        ToggleButtonModule
    ],
    templateUrl: './snow-fall.component.html',
    styleUrl: './snow-fall.component.css'
})
export class SnowFallComponent {
  private christmasAudio: HTMLAudioElement;
  private togglePlayButton = true;

  constructor() {
    this.christmasAudio = new Audio();
    this.christmasAudio.src = 'assets/audio/Brenda Lee - Rockin\' Around The Christmas Tree.mp3';
    this.christmasAudio.volume = 0.03;
  }

  playMusic() {
    this.togglePlayButton = !this.togglePlayButton;
    if (this.togglePlayButton) {
      this.christmasAudio.pause();
    } else {
      this.christmasAudio.play();
    }
  }

}
