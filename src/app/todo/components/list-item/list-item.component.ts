import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { Item } from 'src/app/interfaces';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';


@Component({
  selector: 'app-todo-list-item',
  imports: [ToastModule, CardModule, ReactiveFormsModule, InputTextModule, Dialog, ButtonModule, FloatLabel],
  providers: [MessageService],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly messageService = inject(MessageService);

  @Input() loading = true;
  @Input() items: Item[] = [];
  @Output() sharedLoadEvent = new EventEmitter<void>();
  @ViewChild('editInput') editInput: ElementRef | undefined;

  public itemDescription = '';
  private deleteAudio: HTMLAudioElement;
  public isEditing = false;
  public editingItemId: number | null = null;
  public drawerVisibleSignal = this.todoService.drawerVisibleSignal;
  public mobileView = window.innerWidth <= 768; // check mobil screen

  // Undo variables
  public isDeleting = false;
  public showUndoMessage = false;
  public undoTimeLeft = 5;
  private deletedItemId: number | null = null;
  private undoTimeout: any;
  private countdownInterval: any;
  private deletedItemData: Item | null = null;
  private deletedItemIndex: number = -1;
  public isExiting = false;

  constructor() {
    this.deleteAudio = new Audio();
    this.deleteAudio.src = 'assets/audio/LetitgoDeleteSound.mp3';
  }

  ngOnInit(): void {
    // Disable browser back
    this.drawerVisibleSignal.set(false);
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      this.drawerVisibleSignal.set(true);
      history.pushState(null, '', location.href);
    };
  }

  itemControl = new FormControl('');
  visible: boolean = false;
  editItem(item: Item) {
    // this.isEditing = true;
    this.visible = true;
    this.editingItemId = item.id;
    this.itemControl.patchValue(item.description);
  }

  updateItemDescription() {
    const item = this.items.find(i => i.id === this.editingItemId);
    if (!item) return;
  
    const newValue = this.itemControl.value?.trim() ?? '';
    if (newValue !== '' && newValue !== item.description.trim()) {
      item.description = newValue;
      this.todoService.updateItemDescription(this.todoService.$list_id(), item.id, item).subscribe({
        next: () => {
          this.visible = false;
          this.editingItemId = null;
        },
      });
    } else {
      this.visible = false;
      this.editingItemId = null;
    }
  }

  onDialogCancel() {
    this.visible = false;
    this.editingItemId = null;
  }
  
  deleteItem(item_id: number, description: string) {
    this.isDeleting = true;
    this.deletedItemId = item_id;
    this.deleteAudio.play();
    this.deleteAudio.volume = 0.2;
    this.todoService.hapticsImpactVibration();
    
    // Save the item before removing it
    this.deletedItemIndex = this.items.findIndex(i => i.id === item_id);
    if (this.deletedItemIndex > -1) {
      this.deletedItemData = { ...this.items[this.deletedItemIndex] };
      // Remove visually immediately
      this.items.splice(this.deletedItemIndex, 1);
    }

    this.showUndoMessage = true;
    this.undoTimeLeft = 5;
    this.itemDescription = description;

    // Countdown visual
    this.countdownInterval = setInterval(() => {
      this.undoTimeLeft--;
    }, 1000);

    // Delete after 5 seconds
    this.undoTimeout = setTimeout(() => {
      this.confirmDelete(item_id);
    }, 5000);

    this.showSuccessMessage(this.itemDescription, 'info', this.mobileView, '✓ Deleted');
  }
  undoDelete() {
    this.isExiting = true;

    clearTimeout(this.undoTimeout);
    clearInterval(this.countdownInterval);

    setTimeout(() => {
      this.showUndoMessage = false;
      this.isDeleting = false;
      this.deletedItemId = null;
      this.isExiting = false;
    }, 300);
    
    this.todoService.onsharedLoad(this.sharedLoadEvent);
    this.showSuccessMessage('Deletion cancelled', 'success', this.mobileView, '↩ Restored');
  }

  private confirmDelete(item_id: number) {
    clearInterval(this.countdownInterval);
    
    this.todoService.deleteItem(item_id).subscribe(() => {
      this.showUndoMessage = false;
      this.isDeleting = false;
      this.deletedItemId = null;
      this.showSuccessMessage('Item deleted permanently', 'success', this.mobileView, '✓ Confirmed');
    });
  }

  showSuccessMessage(message: string, severity: string = 'info', isMobile: boolean, summary: string) {
    this.messageService.add({
      key: isMobile ? 'mobileToast' : 'desktopToast',
      severity: severity,
      icon: 'pi pi-check',
      summary: summary,
      detail: message,
    });
  }
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pressTimers: { [key: number]: any } = {}; // Stores timers for each item ID
  public progressMap: { [key: number]: number } = {}; // Stores progress for each item ID
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef);

  startPress(item_id: number, description: string): void {
    this.deleteAudio.play();
    this.deleteAudio.volume = 0.2;
    this.todoService.hapticsImpactVibration();
    this.progressMap[item_id] = 0; // Resets the progress for the specific item
    const duration = 800; // Duration in milliseconds (0.5 seconds)
    const startTime = Date.now();
    this.applyStyles(item_id);

    this.pressTimers[item_id] = setInterval(() => {
      const elapsed = Date.now() - startTime; // Calculate elapsed time
      this.progressMap[item_id] = (elapsed / duration) * 100; // Update progress based on elapsed time
      if (elapsed >= duration) {
        clearInterval(this.pressTimers[item_id]); // Stop the timer once the duration is reached
        this.deleteItem(item_id, description); // Call the delete item function when the duration is over
      }
    }, 16); // Approximate 60 FPS for smooth updates
  }

  cancelPress(item_id: number): void {
    this.deleteAudio.pause();
    this.deleteAudio.currentTime = 0;

    // Stop the color transition timer
    if (this.colorTimers[item_id]) {
      clearTimeout(this.colorTimers[item_id]);
      delete this.colorTimers[item_id];
    }

    // Restore the progress and initial styles
    clearInterval(this.pressTimers[item_id]); // Stop the press timer
    delete this.pressTimers[item_id]; // Remove the press timer from the map
    this.progressMap[item_id] = 0; // Reset the progress value for this item
    this.removeStyles(item_id); // Revert the card to its initial styles
  }

  // const colors = ['#FFE3B5', '#FFD29D', '#AADFB1', '#6FCF97'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private colorTimers: { [key: number]: any } = {}; // Stores timers for managing color transitions

  applyStyles(item_id: number): void {
    const cardElement = this.el.nativeElement.querySelector(`#card-${item_id} .p-card`);
    if (cardElement) {
      // Set up the initial transition for the background color
      this.renderer.setStyle(cardElement, 'transition', 'background-color 1s ease');
      this.renderer.setStyle(cardElement, 'background-color', '#FFF');

      // Clear any previous timer for this item, if it exists
      if (this.colorTimers[item_id]) {
        clearTimeout(this.colorTimers[item_id]);
      }

      // Change to the next color (light green) after 400ms
      this.colorTimers[item_id] = setTimeout(() => {
        this.renderer.setStyle(cardElement, 'background-color', '#6FCF97');
      }, 250);

      // Add additional optional styles
      this.renderer.setStyle(cardElement, 'border-radius', '25px');
      this.renderer.setStyle(cardElement, 'border', '2px solid black');
    }
  }

  removeStyles(item_id: number): void {
    const cardElement = this.el.nativeElement.querySelector(`#card-${item_id} .p-card`);
    if (cardElement) {
      // Stop any ongoing transitions
      this.renderer.setStyle(cardElement, 'transition', 'none');

      // Reset the background color to the initial state
      this.renderer.setStyle(cardElement, 'background-color', '#FFF');

      // Remove additional styles to restore the card to its default state
      this.renderer.removeStyle(cardElement, 'border-radius');
      this.renderer.removeStyle(cardElement, 'border');
    }
  }
}
