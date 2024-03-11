import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TodoService } from 'src/app/services/todo.service';
import { List } from 'src/app/interfaces/list.interface';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AvatarModule, MenuModule,
    SidebarModule, ButtonModule, ToastModule, ReactiveFormsModule,
    DialogModule, InputTextModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private readonly authService      = inject(AuthService);
  private readonly todoService      = inject(TodoService);
  private readonly messageService   = inject(MessageService);
  private readonly fb               = inject(FormBuilder);
  private confirmationService       = inject(ConfirmationService);

  @Output() sharedLoadEvent = new EventEmitter<void>();

  public user = computed(() => this.authService.currentUser());
  public userStatus = computed(() => this.authService.authStatus());
  public userID = computed(() => this.authService.currentUserID());


  public menuOptions: MenuItem[] | null = [];
  public sidebarVisible: boolean = false;
  public user_id = computed(() => this.authService.currentUserID());

  public lists: List[] = [];
  public showModal = false;
  private audio: HTMLAudioElement;

  /**
   * FORM CREATE LIST
   */

  public list: List = {
    id: 0,
    listName: ' ',
  };

  public createNewListForm = this.fb.group({
    listName: [' ', Validators.required],
  });

  /**
 * END FORM CREATE LIST
 */

  constructor() {
    this.audio = new Audio();
    this.audio.src = 'assets/audio/deleteSound.mp3';
  }

  ngOnInit() {
    this.menuOptions = [
      {
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];
    this.loadLists();
  }

  loadLists() {
    this.todoService.getListByUserId(this.userID())
      .subscribe({
        next: (list: List[]) => {
          this.lists = list;
          if (this.todoService.$list_id() === 0) {
            this.todoService.setListId(list[0].id);
            this.todoService.$showAddButton.set(true);
            this.todoService.$listTitle.set(list[0].listName);
            this.todoService.onsharedLoad(this.sharedLoadEvent);
          }
        }
      });
  }

  logout() {
    this.sidebarVisible = false;
    this.authService.logout();
  }

  showItemsFromList(list: List) {
    this.sidebarVisible = false;
    this.todoService.$showAddButton.set(true);
    this.todoService.setListId(list.id);
    this.todoService.$listTitle.set(list.listName);
    this.todoService.onsharedLoad(this.sharedLoadEvent);
  }

  showModalCreateList() {
    this.showModal = true;
  }

  /**
   * FORM FOR CREATE LIST
   */
  submitForm() {
    const list_name = this.createNewListForm.value.listName;
    if (list_name && list_name.trim() !== '') {
      const list: List = {
        id: 0,
        listName: list_name,
      };
      this.sidebarVisible = false;
      this.todoService.createListForUser(this.user_id(), list).subscribe({
        next: () => {
          this.createNewListForm.reset();
          this.todoService.onsharedLoad(this.sharedLoadEvent);
          this.showModal = false;
        },
        error: () => {
          console.error('Duplicate description');
          this.showModal = false;
        },
      });
    } else {
      console.error('ERROR description is undefined or null');
    }
    location.reload();
  }

  confirm(event: Event, list_id: number, list_name: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Borrar la lista "${list_name} "?`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteList(list_id, list_name);
      }
    });
  }

  /**
   * DELETE LIST
   * @param list_id 
   * @param list_name 
   */
  deleteList(list_id: number, list_name: string) {
    this.sidebarVisible = false;
    this.todoService.deleteList(list_id).subscribe(() => {
      this.todoService.onsharedLoad(this.sharedLoadEvent);
      this.todoService.$listTitle.set('');
      this.showListSuccessMessageDeleted(list_name);
      this.audio.play();
      this.loadLists();
    });
  }

  /**
   * DELETE MESSAGE
   */
  showListSuccessMessageDeleted(list_name: string) {
    this.messageService.add({
      key: 'toastSucces',
      severity: 'success',
      summary: `Lista "${list_name} " Eliminada!`
    });
  }
}
