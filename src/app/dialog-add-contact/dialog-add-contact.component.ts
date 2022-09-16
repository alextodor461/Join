import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-dialog-add-contact',
  templateUrl: './dialog-add-contact.component.html',
  styleUrls: ['./dialog-add-contact.component.scss']
})
export class DialogAddContactComponent implements OnInit, OnDestroy {

  userToDeleteId!: number;

  userToDeleteUsername!: string;

  addNewContactForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  destroy = new Subject();

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogAddContactComponent>,
    private toast: HotToastService
  ) { }

  ngOnInit(): void { }

  /**
   * Gets the username form control.
   */
  get username() {

    return this.addNewContactForm.get('username');

  }

  /**
   * Gets the password form control.
   */
  get password() {

    return this.addNewContactForm.get('password');

  }

  /**
   * Gets the confirmPassword form control.
   */
  get confirmPassword() {

    return this.addNewContactForm.get('confirmPassword');

  }

  /**
   * Checks if the password and confirmPassword form controls have the same value (but only if they are not empty) and if so, it
   * returns true. The function returns false if these two form controls have different values.
   * @returns - true or false, depending on wether the password and confirmPassword form controls have the same value or not.
   */
  checkPasswordsMatch() {

    const passwordCurrentValue = this.password?.value;
    const confirmPasswordCurrentValue = this.confirmPassword?.value;

    //Only checks for match if both the password and confirmPassword form controls have some value.
    if (passwordCurrentValue.length && confirmPasswordCurrentValue.length) {

      return this.password?.value === this.confirmPassword?.value;

    } else {

      return true;

    }

  }

  /**
   * By calling the createUser function from the user service creates a new user with the passed-in data or not.
   */
  createContact() {

    const newUser: User = new User();

    newUser.username = this.username?.value;
    newUser.password = this.password?.value;

    this.userService.createUser(newUser).pipe(takeUntil(this.destroy)).subscribe((data: User[] | string) => {

      //If the username from the passed-in data matches any username from the server, no user is created.
      if (data === `There is already one user with the username '${newUser.username}'.`) {

        this.dialogRef.close();

        //And an unsuccessful conctact creation message is displayed.
        this.toast.warning(`There is already one user with the username '${newUser.username}'.`);

        //But, if the username from the passed-in data does not match any username from the server, a new user is created.
      } else {

        this.dialogRef.close(data); //And the from-the-server-received data is passed to the contacts component.

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
