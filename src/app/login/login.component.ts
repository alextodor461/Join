import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  destroy = new Subject();

  constructor(
    private router: Router,
    private toast: HotToastService,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void { }

  /**
   * Gets the username form control.
   */
  get username() {

    return this.loginForm.get('username');

  }

  /**
   * Gets the password form control.
   */
  get password() {

    return this.loginForm.get('password');

  }

  /**
   * Calls the getAllUsers function from the user service to get all the users from the server. Then, it looks for the user object that
   * matches the passed-in data and logs in (or not) the user.
   */
  submit() {

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      const userFromTheDb = data.find((user: User) => user.username === this.username?.value && user.password === this.password?.value);

      //If there is a user object in the database that matches the passed-in data...
      if (userFromTheDb) {

        this.authService.currentUser = userFromTheDb;
        this.authService.saveCurrentUser();
        this.successfulLogin();

      //If there is NO user object in the database that matches the passed-in data...
      } else {

        this.unsuccessfulLogin();

      }

    });

  }

  /**
   * Displays a successful login message and navigates the user to the summary view.
   */
  successfulLogin() {

    this.toast.success('Logged in succesfully!');
    this.router.navigate(['/summary']);

  }

  /**
   * Displays an unsuccessful login message.
   */
  unsuccessfulLogin() {

    this.toast.error('Invalid username or password.');

  }

  /**
   * Does exactly the same as the submit function but with hard coded data.
   */
  loginAsGuest() {

    const guest: User = new User();

    //Hard coded data.
    guest.username = "guest";
    guest.password = "guest";

    this.userService.getAllUsers().pipe(takeUntil(this.destroy)).subscribe((data: User[]) => {

      //There is a "guest" user in the server that cannot be deleted (from the frontend). Meaning: the function will always find
      //the user object that matches the hard coded data.
      const guestFromDb = data.find((user: User) => user.username === guest.username && user.password === guest.password);

      if (guestFromDb) {

        this.authService.currentUser = guestFromDb;
        this.authService.saveCurrentUser();
        this.successfulLogin();

      //Since the function will always find the user object that matches the hard coded data, this is not really necessary. It could
      //be removed in the future.
      } else {

        this.toast.error('Log in as guest is not possible yet.');

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
