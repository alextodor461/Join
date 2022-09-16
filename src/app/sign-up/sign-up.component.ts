import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  destroy = new Subject();

  constructor(
    private router: Router,
    private toast: HotToastService,
    private userService: UserService
  ) { }

  ngOnInit(): void { }

  /**
   * Gets the username form control.
   */
  get username() {

    return this.signupForm.get('username');

  }

  /**
   * Gets the password form control.
   */
  get password() {

    return this.signupForm.get('password');

  }

  /**
   * Gets the confirmPassword form control.
   */
  get confirmPassword() {

    return this.signupForm.get('confirmPassword');

  }

  /**
   * Checks if the password and confirmPassword form controls have the same value (but only if they are not empty) and if so, it
   * returns "true". The function returns "false" if these two form controls have different values.
   * @returns - "true" or "false", depending on wether the password and confirmPassword form controls have the same value or not.
   */
  checkPasswordsMatch() {

    const passwordCurrentValue = this.password?.value;
    const confirmPasswordCurrentValue = this.confirmPassword?.value;

    //Only checks for match if both the password and confirmPassword form controls have value (if they are not empty).
    if (passwordCurrentValue.length && confirmPasswordCurrentValue.length) {

      return this.password?.value === this.confirmPassword?.value;

    } else {

      return true;

    }

  }

  /**
   * By calling the createUser function from the user service creates a new user with the passed-in data or not.
   */
  submit() {

    const newUser: User = new User();

    newUser.username = (this.username?.value).replace(/ /g, '');
    newUser.password = this.password?.value;

    this.userService.createUser(newUser).pipe(takeUntil(this.destroy)).subscribe((data: User[] | string) => {

      //If the username from the passed-in data matches any username on the server, no user is created.
      if (data === `There is already one user with the username '${newUser.username}'.`) {

        this.unsuccessfulResgistration();

      //But, if the username from the passed-in data does not match any username on the server, a new user is created.
      } else {

        this.successfulResgistration();

      }

    });

  }

  /**
   * Displays a successful registration message and navigates the user to the login view.
   */
  successfulResgistration() {

    this.toast.success('New user succesfully created!');
    this.router.navigate(['/login']);

  }

  /**
   * Displays an unsuccessful registration message.
   */
  unsuccessfulResgistration() {

    this.toast.error(`There is already one user with the username '${this.username?.value}'.`);

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
