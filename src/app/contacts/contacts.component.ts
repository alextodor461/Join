import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';
import { DialogAddContactComponent } from '../dialog-add-contact/dialog-add-contact.component';
import { DialogDeleteContactComponent } from '../dialog-delete-contact/dialog-delete-contact.component';
import { DialogEditContactComponent } from '../dialog-edit-contact/dialog-edit-contact.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  currentUser!: User;

  users: User[] = [];

  destroy = new Subject();

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private toast: HotToastService,
    private authService: AuthenticationService
  ) { }

  /**
   * Gets all the users from the server by calling the getAllUsers function from the user service. It then excludes the "guest" user
   * object from the data (this is done because we do not want the "guest" user to be displayed, edited or deleted). It also assigns
   * to the local variable "currentUser" the current user (which is obtained from the local storage thanks to the getCurrentUser
   * function from the authentication service).
   */
  ngOnInit(): void {

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      const usersExcludingGuest = data.filter(e => e.username !== "guest");
      this.users = usersExcludingGuest;

    });

    this.currentUser = this.authService.getCurrentUser();

  }

  addNewContact() {

    const dialogRef = this.dialog.open(DialogAddContactComponent);

    dialogRef.afterClosed().subscribe((data: User[]) => {

      if (data) {

        this.updateUsersArray(data);
        this.toast.success('New contact succesfully added!');

      }

    });

  }

  editContact(contact: User) {

    //If the current user is Vincent, Alex or Florian...
    if (this.currentUser.id === 1 || this.currentUser.id === 2 || this.currentUser.id === 3) {

      const dialogRef = this.dialog.open(DialogEditContactComponent, {

        data: {
          id: contact.id,
          username: contact.username,
          password: contact.password
        }

      });

      dialogRef.afterClosed().subscribe((data: User[]) => {

        if (data) {

          this.updateUsersArray(data);
          this.toast.success('Contact succesfully edited!');

        }

      });

    } else if (this.currentUser.id === contact.id) {

      const dialogRef = this.dialog.open(DialogEditContactComponent, {

        data: {
          id: contact.id,
          username: contact.username,
          password: contact.password
        }

      });

      dialogRef.afterClosed().subscribe((data: User[]) => {

        if (data) {

          this.updateUsersArray(data);
          this.toast.success('Contact succesfully edited!');

        }

      });

    } else {

      this.toast.warning('You are not authorized to edit contacts except your own');

    }

  }

  deleteContact(contact: User) {

    //If the current user is Vincent, Alex or Florian...
    if (this.currentUser.id === 1 || this.currentUser.id === 2 || this.currentUser.id === 3) {

      const dialogRef = this.dialog.open(DialogDeleteContactComponent, {

        data: {
          id: contact.id,
          username: contact.username
        }

      });

      dialogRef.afterClosed().subscribe((data: User[]) => {

        if (data) {

          this.updateUsersArray(data);
          this.toast.success('Contact succesfully deleted!');

        }

      });

    } else if (this.currentUser.id === contact.id) {

      const dialogRef = this.dialog.open(DialogDeleteContactComponent, {

        data: {
          id: contact.id,
          username: contact.username
        }

      });

      dialogRef.afterClosed().subscribe((data: User[]) => {

        if (data) {

          this.updateUsersArray(data);
          this.toast.success('Contact succesfully deleted!');

        }

      });

    } else {

      this.toast.warning('You are not authorized to delete contacts except your own');

    }

  }

  /**
   * Updates the local array "users".
   * @param data - This is the passed-in data (the passed-in array from users).
   */
  updateUsersArray(data: User[]) {

    this.users = data;

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
