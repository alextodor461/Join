import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dialog-edit-contact',
  templateUrl: './dialog-edit-contact.component.html',
  styleUrls: ['./dialog-edit-contact.component.scss']
})
export class DialogEditContactComponent implements OnInit, OnDestroy {

  editContactForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  destroy = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogEditContactComponent>,
    private toast: HotToastService
  ) { }

  /**
   * Using the data properties from the contacts component sets both form control values from the editContact form group.
   */
  ngOnInit(): void {

    this.username?.setValue(this.data.username);
    this.password?.setValue(this.data.password);

  }

  /**
   * Gets the username form control.
   */
  get username() {

    return this.editContactForm.get('username');

  }

  /**
   * Gets the password form control.
   */
  get password() {

    return this.editContactForm.get('password');

  }

  /**
   * Taking the values of the two form controls updates the user object that corresponds to the passed-in id (you can find it in the 
   * updateUser function) on the server (it does it by calling the updateUser function from the user service). It then checks if there
   * is already a user with the passed-in username and if not, closes the dialog and passes to the contacts component the data 
   * obtained after updating that user (all the users, including the recently updated user with the updated info).
   * IMPORTANT! --> We want this function to pass all the users (updated) to the contacts component, because this component will make 
   * use of this data to update its users array.
   */
  saveChanges() {

    const editedContact: User = new User();

    const id = this.data.id;

    editedContact.username = (this.username?.value).replace(/ /g, '');
    editedContact.password = this.password?.value;

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      const alreadyThisUsername = data.find((user: User) => user.username === editedContact.username);

      //If the new username matches any username on the server, the user is not updated.
      if (alreadyThisUsername) {

        this.dialogRef.close();
        this.toast.warning(`There is already one user with the username '${editedContact.username}'.`);

      //But, if the username does not match any username on the server, the user is updated.
      } else {

        this.userService.updateUser(id, editedContact).pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

          this.dialogRef.close(data);

        });

      }

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
