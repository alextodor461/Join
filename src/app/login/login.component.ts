import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/models/user';
import { UserPlusToken } from 'src/models/userPlusToken';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])
  });

  destroy = new Subject();

  constructor(
    private router: Router,
    private toast: HotToastService,
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
   * By calling the loginUser function from the authentication service logs in the user or not.
   */
  submit() {

    const userToLogIn: User = new User();

    userToLogIn.username = (this.username?.value).replace(/ /g, '');
    userToLogIn.password = this.password?.value;

    this.authService.loginUser(userToLogIn).pipe(takeUntil(this.destroy)).subscribe({

      //If the passed-in username and the password match any user data on the server, the user is logged in.
      next: (data: UserPlusToken) => {

        this.authService.currentUserPlusToken = data;
        this.authService.saveCurrentUser();  //The logged-in user data is stored in the local storage thanks to this function from the authentication service.
        this.successfulLogin();

      },

      //But, if the passed-in username and the password does not match any user data on the server, the user is not logged in.
      error: (e) => {

        console.error(e);
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
    guest.password = "Guest54321@";

    this.authService.loginUser(guest).pipe(takeUntil(this.destroy)).subscribe((data: UserPlusToken) => {

      this.authService.currentUserPlusToken = data;
      this.authService.saveCurrentUser();
      this.successfulLogin();

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}
