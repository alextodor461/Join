import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { UserPlusToken } from 'src/models/userPlusToken';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';
import { DialogAddContactComponent } from '../dialog-add-contact/dialog-add-contact.component';
import { DialogDeleteContactComponent } from '../dialog-delete-contact/dialog-delete-contact.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  currentUser!: UserPlusToken;

  users: User[] = [];

  destroy = new Subject();

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private toast: HotToastService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * Gets all the users from the server by calling the getAllUsers function from the user service. It then excludes the "guest" user
   * object from the data (this is done because we do not want the "guest" user to be displayed, edited or deleted). Finally, it 
   * assigns to the local variable "currentUser" the current user (which is obtained from the local storage thanks to the 
   * getCurrentUser function from the authentication service).
   */
  ngOnInit(): void {

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      const usersExcludingGuest = data.filter(e => e.username !== "guest");
      this.users = usersExcludingGuest;

    });

    this.currentUser = this.authService.getCurrentUser();

  }

  /**
   * Opens the DialogAddContactComponent and, when this is closed, uses the from-the-DialogAddContactComponent-received data to update 
   * the local array "users".
   */
  addNewContact() {

    const dialogRef = this.dialog.open(DialogAddContactComponent);

    dialogRef.afterClosed().subscribe((data: User[]) => {

      if (data) {

        this.refreshPage();
        this.toast.success('New contact succesfully added!');

      }

    });

  }

 
  /**
   * If the current user is Vincent, Alex or Florian, or if the current user clicks the "Delete" button that corresponds to his/her own
   * contact, the function opens the DialogDeleteContactComponent, passes two of the passed-in contact properties to it (as a data 
   * object) and, when this is closed, uses the from-the-DialogDeleteContactComponent-received data to update the local array "users".
   * @param contact - This is the passed-in contact.
   */
  deleteContact(contact: User) {

    //If the current user is Vincent, Alex or Florian...
    if (this.currentUser.user.id === 1 || this.currentUser.user.id === 2 || this.currentUser.user.id === 3) {

      const dialogRef = this.dialog.open(DialogDeleteContactComponent, {

        data: {
          id: contact.id,
          username: contact.username
        }

      });

      dialogRef.afterClosed().subscribe((data: User[]) => {

        if (data) {

          this.refreshPage();
          this.toast.success('Contact succesfully deleted!');

        }

      });

    //If the current tries to delete his/her own contact...
    } else if (this.currentUser.user.id === contact.id) {

      const dialogRef = this.dialog.open(DialogDeleteContactComponent, {

        data: {
          id: contact.id,
          username: contact.username
        }

      });

      dialogRef.afterClosed().subscribe((data: User[]) => {

        if (data) {

          this.refreshPage();
          this.toast.success('Contact succesfully deleted!');

        }

      });

    //If the current user is NOT Vincent, Alex or Florian and he/she tries to delete a contact that is not his/her own.
    } else {

      this.toast.warning('You are not authorized to delete contacts except your own.');

    }

  }

  refreshPage() {

    let currentUrl = this.router.url;

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {

        this.router.navigate([currentUrl]);

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
