import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string = 'Join';

  constructor(
    private router: Router, 
    private auth: AuthenticationService, 
    private toast: HotToastService
    ) { }

  ngOnInit(): void { }

  /**
   * Checks the current URL and returns "false" if it is "/login" or "/signup" or "true" if it is neither of those.
   * @returns - "true" or "false", depending on the currentPath variable value.
   */
  checkNotLoginOrSignup() {

    const currentPath = this.router.url;
    return currentPath === '/login' || currentPath === '/signup' ? false : true;

  }

  /**
   * Logs out the user by calling the deleteCurrentUser function from the authentication service and displays a successful logout
   * message. 
   */
  logout() {

    this.auth.deleteCurrentUser();
    this.toast.success('Logged out succesfully! See you again soon :)');

  }

}
