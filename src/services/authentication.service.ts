import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';
import { UserPlusToken } from 'src/models/userPlusToken';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUser!: User;

  private loginUrl: string = "https://vicentbotellaferragud.pythonanywhere.com/users/login/";

  constructor(private router: Router, private http: HttpClient) { }

  public loginUser(user: User): Observable<UserPlusToken> {

    return this.http.post<UserPlusToken>(this.loginUrl, user);

  }

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
