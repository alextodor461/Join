import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
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

  users: User[] = [];

  destroy = new Subject();

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  /**
   * Gets all the users from the server by calling the getAllUsers function from the user service. It then excludes the "guest" user
   * object from the data (this is done because we do not want the "guest" user to be displayed, edited or deleted).
   */
  ngOnInit(): void {

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      const usersExcludingGuest = data.filter(e => e.username !== "guest");
      this.users = usersExcludingGuest;

    });

  }

  addNewContact() {

    const dialogRef = this.dialog.open(DialogAddContactComponent);

  }

  editContact(contact: User) {

    const dialogRef = this.dialog.open(DialogEditContactComponent);
    
  }

  deleteContact(contact: User) {

    const dialogRef = this.dialog.open(DialogDeleteContactComponent);
    
  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
