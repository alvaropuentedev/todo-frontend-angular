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
  private undoTimeout: number | null = null;
  private countdownInterval: number | null = null;
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
    this.todoService.hapticsImpactVibration();
    this.deleteAudio.volume = 0.2;
    this.deleteAudio.play();
    
    // Save the item before removing it
    this.deletedItemIndex = this.items.findIndex(i => i.id === item_id);
    if (this.deletedItemIndex > -1) {
      this.deletedItemData = { ...this.items[this.deletedItemIndex] };
      // Remove visually immediately
      this.items.splice(this.deletedItemIndex, 1);
    }

    this.showUndoMessage = true;
    this.itemDescription = description;

    // Delete after 5 seconds
    this.undoTimeout = setTimeout(() => {
      this.confirmDelete(item_id);
    }, 5000);

    // this.showSuccessMessage('✓ Eliminado', 'info', this.mobileView, this.itemDescription);
  }
  undoDelete() {
    this.isExiting = true;

    this.undoTimeout && clearTimeout(this.undoTimeout);
    this.countdownInterval && clearInterval(this.countdownInterval);

    setTimeout(() => {
      this.showUndoMessage = false;
      this.isDeleting = false;
      this.deletedItemId = null;
      this.isExiting = false;
    }, 300);
    
    this.todoService.onsharedLoad(this.sharedLoadEvent);
    this.showSuccessMessage('Elemento restaurado', 'success', this.mobileView, this.itemDescription);
  }

  private confirmDelete(item_id: number) {
    this.countdownInterval && clearInterval(this.countdownInterval);
    
    this.todoService.deleteItem(item_id).subscribe(() => {
      this.showUndoMessage = false;
      this.isDeleting = false;
      this.deletedItemId = null;
      this.showSuccessMessage('Eliminado permanentemente', 'error', this.mobileView, this.itemDescription);
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
}
