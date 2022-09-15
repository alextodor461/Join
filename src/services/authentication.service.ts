import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUser!: User;

  constructor(private router: Router) { }

  /**
   * Stores the current user in the local storage.
   */
  saveCurrentUser() {

    const currentUserAsText = JSON.stringify(this.currentUser);
    localStorage.setItem('currentUserAsText', currentUserAsText);

  }

  /**
   * Gets the current user from the local storage.
   * IMPORTANT! --> This function is always called after the saveCurrentUser function. Therefore, there is always one user in the
   * local storage to retrieve.
   */
  getCurrentUser() {

    const currentUserAsText = localStorage.getItem('currentUserAsText');

    if (currentUserAsText) {

      this.currentUser = JSON.parse(currentUserAsText);
      
    }

    return this.currentUser;

  }

  /**
   * Deletes the current user from the local storage and navigates the user to the login view.
   */
  deleteCurrentUser() {

    localStorage.removeItem('currentUserAsText');
    this.router.navigate(['/login']);

  }

}
