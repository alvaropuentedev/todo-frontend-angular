import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TodoService } from 'src/app/services/todo.service';
import { List } from 'src/app/interfaces/list.interface';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { User } from 'src/app/interfaces';
import { DrawerModule } from "primeng/drawer";
import { OverlayBadge } from "primeng/overlaybadge";

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    AvatarModule,
    MenuModule,
    DrawerModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    OverlayBadge
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
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
  public settingModalVisible = false;

  public lists: List[] = [];
  public showModal = false;
  private audio: HTMLAudioElement;
  public mobileView = window.innerWidth <= 768; // check mobil screen
  public positionSidebar = 'left';
  public drawerVisibleSignal = this.todoService.drawerVisibleSignal;
  public handleFocus = this.todoService.handleFocus;

  /**
   * FORM CREATE LIST
   */

  public list: List = {
    id: 0,
    listName: '',
  };

  public createNewListForm = this.fb.group({
    listName: ['', Validators.required],
  });

  public shareListWithUserForm = this.fb.group({
    user: ['', Validators.required],
  });

  public searchList = this.fb.group({
    filterText: ['', Validators.required],
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
      this.positionSidebar = 'full';
      this.drawerVisibleSignal.set(false);
    }
    this.loadLists();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
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
    this.drawerVisibleSignal.set(false);
    this.authService.logout();
  }

  // List filter
  getFilteredLists() {
    const filterText = (this.searchList.get('filterText')?.value?.toLowerCase() || '').trim();
    return this.lists.filter(list =>
      list.listName.toLowerCase().includes(filterText)
    );
  }

  // Reset filter
  resetFilterText() {
    this.todoService.hapticsImpactVibration();
    this.searchList.reset();
    if (this.mobileView) {
      this.positionSidebar = 'full';
      this.drawerVisibleSignal.set(true);
    } else {
      this.positionSidebar = 'left';
      this.drawerVisibleSignal.set(true);
    }
  }

  showItemsFromList(list: List) {
    this.todoService.hapticsImpactVibration();
    this.drawerVisibleSignal.set(false);
    this.todoService.$showAddButton.set(true);
    this.todoService.setListId(list.id);
    this.todoService.$listTitle.set(list.listName);
    localStorage.setItem('list_title', list.listName);
    this.todoService.onsharedLoad(this.sharedLoadEvent);
  }

  showModalCreateList() {
    this.createNewListForm.reset();
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
      this.todoService.createListForUser(this.user_id(), list).subscribe({
        next: () => {
          this.createNewListForm.reset();
          this.todoService.onsharedLoad(this.sharedLoadEvent);
          this.showModal = false;
          this.loadLists();
        },
        error: (error) => {
          console.error('Error creating list:', error);
          this.messageService.add({
            key: 'toastError',
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la lista. Inténtalo nuevamente.',
          });
        }
      });

    } else {
      console.error('ERROR description is undefined or null');
    }
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
    const list_title_local = localStorage.getItem('list_title');
    this.todoService.deleteList(this.authService.currentUserID(), list_id).subscribe({
      next: () => {
        this.showListSuccessMessageDeleted(list_name);
        this.audio.play();
        this.loadLists();
        if (list_title_local === list_name) {
          localStorage.setItem('list_title', 'Lista ' + list_name + ' eliminada');
        }
      },
      error: (err) => {
        console.error('Error deleting the list:', err);
        this.messageService.add({
          key: 'toastError',
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la lista. Inténtalo nuevamente.',
        });
      }
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

  shareListWithUser(event: Event) {
    const list_id = localStorage.getItem('list_id');
    if (list_id) {
      // Parse the list_id to an integer
      const parsedListId = parseInt(list_id, 10);
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
            this.addUserToList(parsedListId, user);
            this.shareListWithUserForm.reset();
          } else {
            alert('Por favor ingresa un nombre de usuario válido.');
          }
        },
      });
    }
  }

  showSuccessMessage(user: string) {
    this.messageService.add({
      key: 'toastSucces',
      severity: 'info',
      icon: 'pi pi-check',
      summary: 'Compartido con el usuari@',
      detail: user.toUpperCase(),
    });
  }

  showErrorMessage(msg: string) {
    this.messageService.add({
      key: 'toastSucces',
      severity: 'info',
      icon: 'pi pi-exclamation-triangle',
      summary: 'Error',
      detail: msg,
    });
  }

  /**
   * Add user to list
   * @param list_id
   * @param user
   */
  addUserToList(list_id: number, user: string) {
    this.drawerVisibleSignal.set(false);

    this.todoService.addUsersToList(list_id, user).subscribe({
      next: () => {
        this.audio.play();
        this.loadLists();
        this.showSuccessMessage(user);
      },
      error: (err) => {
        this.showErrorMessage(err.error);
      },
    });
  }
}
