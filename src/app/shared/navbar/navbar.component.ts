import { CommonModule } from '@angular/common';
import {Component, EventEmitter, OnInit, Output, computed, inject, HostListener} from '@angular/core';
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
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    MenuModule,
    SidebarModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly todoService = inject(TodoService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);

  @Output() sharedLoadEvent = new EventEmitter<void>();

  public user = computed(() => this.authService.currentUser());
  public userStatus = computed(() => this.authService.authStatus());
  public user_id = computed(() => this.authService.currentUserID());

  public menuOptions: MenuItem[] | null = [];
  public sidebarVisible: boolean = false;
  public settingModalVisible = false;

  public lists: List[] = [];
  public showModal = false;
  private audio: HTMLAudioElement;
  public mobileView = window.innerWidth <= 768; // check mobil screen


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

  public shareListWithUserForm = this.fb.group({
    user: [' ', Validators.required],
  });

  public searchList = this.fb.group({
    filterText: [' ', Validators.required],
  });

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
    if (this.mobileView) {
      this.sidebarVisible = true;
    }
    this.loadLists();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mobileView = window.innerWidth <= 768;
  }

  loadLists() {
    this.todoService.getListByUserId(this.user_id()).subscribe({
      next: (list: List[]) => {
        this.lists = list;
        if (this.todoService.$list_id() === 0) {
          this.todoService.setListId(list[0].id);
          this.todoService.$showAddButton.set(true);
          this.todoService.$listTitle.set(list[0].listName);
          localStorage.setItem('list_title', list[0].listName);
          this.todoService.onsharedLoad(this.sharedLoadEvent);
        }
      },
    });
  }

  logout() {
    this.sidebarVisible = false;
    this.authService.logout();
  }

  // List filter
  getFilteredLists() {
    const filterText = this.searchList.get('filterText')?.value?.toLowerCase() || '';
    return this.lists.filter(list =>
      list.listName.toLowerCase().includes(filterText)
    );
  }
  // Reset filter
  resetFilterText() {
    navigator.vibrate([1000, 500, 2000]);
    this.searchList.reset();
    this.sidebarVisible = true;
  }

  showItemsFromList(list: List) {
    this.sidebarVisible = false;
    this.todoService.$showAddButton.set(true);
    this.todoService.setListId(list.id);
    this.todoService.$listTitle.set(list.listName);
    localStorage.setItem('list_title', list.listName);
    this.todoService.onsharedLoad(this.sharedLoadEvent);
  }

  showModalCreateList() {
    this.showModal = true;
  }

  /**
   * FORM FOR CREATE LIST
   */
  submitCreateListForm() {
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
    // Add a 2-second delay before reloading the page
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  confirmDeleteList(event: Event, list_id: number, list_name: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      key: 'cdDelete',
      message: `¿Eliminar la lista "${list_name} "?`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.deleteList(list_id, list_name);
      },
    });
  }

  /**
   * DELETE LIST
   * @param list_id
   * @param list_name
   */
  deleteList(list_id: number, list_name: string) {
    this.sidebarVisible = false;
    const list_title_local = localStorage.getItem('list_title');
    this.todoService.deleteList(list_id).subscribe({
      next: () => {
        this.showListSuccessMessageDeleted(list_name);
        this.audio.play();
        this.loadLists();
        if (list_title_local === list_name) {
          localStorage.setItem('list_title', 'Lista ' + list_name + ' eliminada');
        }
        // Add a 2-second delay before reloading the page
        setTimeout(() => {
          location.reload();
        }, 1700);
      },
    });
  }

  /**
   * DELETE MESSAGE
   */
  showListSuccessMessageDeleted(list_name: string) {
    this.messageService.add({
      key: 'toastSucces',
      severity: 'success',
      summary: `Lista "${list_name} " Eliminada!`,
    });
  }

  /**
   * DELETE USER COINFIRM
   * @param event
   */
  confirmDeleteUser(event: Event) {
    const user_name = this.user();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Eliminar usuario "${user_name} "?`,
      key: 'cdDelete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        if (user_name) {
          this.deleteUser(user_name);
        }
      },
    });
  }

  deleteUser(user_name: User) {
    this.authService.deleteUserByID(this.user_id()).subscribe({
      next: () => {
        this.showUserSuccessMessageDeleted(user_name);
        this.logout();
      },
    });
  }

  showUserSuccessMessageDeleted(user_name: User) {
    this.messageService.add({
      key: 'toastSucces',
      severity: 'success',
      summary: `Lista "${user_name} " Eliminada!`,
    });
  }

  shareListWithUser(event: Event, list_id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      key: 'cdWithInput',
      message: `Compartir lista con el usuari@`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        const user = this.shareListWithUserForm.get('user')?.value?.trim().toLocaleLowerCase();
        if (user) {
          this.addUserToList(list_id, user);
          this.shareListWithUserForm.reset();
        } else {
          alert('Por favor ingresa un nombre de usuario válido.');
        }
      },
    });
  }

  /**
   * Add user to list
   * @param list_id
   * @param user
   */
  addUserToList(list_id: number, user: string) {
    this.sidebarVisible = false;

    this.todoService.addUsersToList(list_id, user).subscribe({
      next: () => {
        this.audio.play();
        this.loadLists();
        setTimeout(() => {
          location.reload();
        }, 1700);
      },
      error: (err) => {
        console.error('Error al añadir el usuario:', err);
        alert('Hubo un error al añadir el usuario. Inténtalo nuevamente.');
      },
    });
  }

}
