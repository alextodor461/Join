import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dialog-delete-contact',
  templateUrl: './dialog-delete-contact.component.html',
  styleUrls: ['./dialog-delete-contact.component.scss']
})
export class DialogDeleteContactComponent implements OnInit, OnDestroy {

  userToDeleteId!: number;

  userToDeleteUsername!: string;

  destroy = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    public dialogRef: MatDialogRef<DialogDeleteContactComponent>,
    private userService: UserService
  ) { }

  /**
   * Assigns to the local variables "userToDeleteId" and "userToDeleteUsername" the data properties (data comes from the contacts 
   * component) so that the template can make use of these.
   */
  ngOnInit(): void {

    this.userToDeleteId = this.data.id;
    this.userToDeleteUsername = this.data.username;

  }

  /**
   * Calls the deleteUser function from the user service to delete the user that corresponds to the passed-in id and then closes the
   * dialog, passing to the board component the data obtained after deleting that user (a message confirming the user deletion).
   * @param userId - This is the passed-in user id.
   */
  deleteContact(userId: number) {

    this.userService.deleteUser(userId).pipe(takeUntil(this.destroy)).subscribe((data: string) => {

      this.dialogRef.close(data);

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
